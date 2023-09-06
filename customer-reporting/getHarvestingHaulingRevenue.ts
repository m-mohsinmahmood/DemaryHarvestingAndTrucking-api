import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const customer_id = req.query.customer_id;

        let getHarvestingServices = `
        WITH CTE_Harvesting_Service AS (
            Select 
            
                customer.id AS customer_id,
                customer.customer_name AS customer_name,
                cjs.job_setup_name AS job_name,
                cjs.farm_id AS farm_id,
                cf."name" AS farm_name,
                crop.id AS crop_id,
                crop."name" AS crop_name,
                'acre' AS rate_type,
                cjs.crop_acres AS quantity,
                cjs.crop_acres AS crop_acres,
                cr.combining_rate AS rate,
                (cjs.crop_acres::float * cr.combining_rate::float) AS revenue,
                (cjs.crop_acres::float * cr.combining_rate::float)/cjs.crop_acres::float AS revenue_per_acre,
                calculate_weight(cjs.id) / crop.bushel_weight AS revenue_per_bushel
                
                from
                
                    "Customer_Job_Setup" cjs
                    INNER JOIN "Customers" customer ON cjs.customer_id = customer."id"
                    INNER JOIN "Customer_Farm" cf ON cjs.farm_id = cf."id" AND cf.is_deleted = FALSE 
                    INNER JOIN "Crops" crop ON cjs.crop_id = crop."id"
                    INNER JOIN "Combining_Rates" cr ON cr.customer_id = cjs.customer_id AND cjs.farm_id = cr.farm_id AND cjs.crop_id = cr.crop_id AND cr.is_deleted = FALSE 
                
                where 
                    cjs.customer_id = '${customer_id}' AND cjs.is_job_completed = TRUE
        )
        SELECT
            *,
            revenue::NUMERIC / crop_acres::NUMERIC AS revenue_per_acre,
            revenue::NUMERIC / revenue_per_bushel::NUMERIC AS revenue_per_bushel
            
        FROM
            CTE_Harvesting_Service;
        ;`;

        let getHaulingServices = `
        WITH CTE_Hauling_Service AS (
            SELECT
                customer.id AS customer_id,
                customer.customer_name AS customer_name,
                cjs.job_setup_name AS job_name,
                cjs.farm_id AS farm_id,
                cf."name" AS farm_name,
                crop.id AS crop_id,
                crop."name" AS crop_name,
                hr.rate_type AS rate_type,
                cjs.crop_acres::float AS crop_acres,
                calculate_weight(cjs.id) / crop.bushel_weight AS revenue_per_bushel,
                CASE
                    WHEN hr.rate_type = 'Bushels' THEN calculate_weight(cjs.id) / crop.bushel_weight
                    WHEN hr.rate_type = 'Bushels + Excess Yield' THEN ((calculate_weight(cjs.id) / crop.bushel_weight) - (cjs.crop_acres::NUMERIC * hr.base_bushels))
                    WHEN hr.rate_type = 'Hundred Weight' THEN calculate_weight(cjs.id) / 100
                    WHEN hr.rate_type = 'Miles' THEN (SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::INTEGER, 0)) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id)
                    WHEN hr.rate_type = 'Ton Miles' THEN calculate_weight(cjs.id) / 2000
                    WHEN hr.rate_type = 'Tons' THEN calculate_weight(cjs.id) / 2000
                    WHEN hr.rate_type = 'Load Count' THEN (SELECT COUNT(hdt.id) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id)
                    ELSE 0
                END AS quantity,
                hr.rate AS rate,
                hr.base_bushels AS base_bushels,
                hr.base_rate AS base_rate,
                hr.premium_rate AS premium_rate,
                CASE
                    WHEN hr.rate_type = 'Bushels' THEN ( calculate_weight(cjs.id) / crop.bushel_weight) * hr.rate
                    WHEN hr.rate_type = 'Bushels + Excess Yield' THEN ( ( calculate_weight(cjs.id) / crop.bushel_weight) * hr.premium_rate ) + ( ( ( calculate_weight(cjs.id) / crop.bushel_weight) - (cjs.crop_acres::NUMERIC * hr.base_bushels) ) * hr.premium_rate )
                    WHEN hr.rate_type = 'Hundred Weight' THEN (calculate_weight(cjs.id) / 100) * hr.rate
                    WHEN hr.rate_type = 'Miles' THEN (SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::INTEGER, 0)) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id) * hr.rate
                    WHEN hr.rate_type = 'Ton Miles' THEN (SELECT (hr.premium_rate * (SUM(COALESCE(NULLIF(loaded_miles, '')::INTEGER, 0)) / COUNT(hdt.id)) + hr.base_rate) * (calculate_weight(cjs.id) / 2000) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id)
                    WHEN hr.rate_type = 'Tons' THEN (calculate_weight(cjs.id) / 2000) * hr.rate
                    WHEN hr.rate_type = 'Load Count' THEN (SELECT COUNT(hdt.id) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id) * hr.rate
                    ELSE 0
                END AS revenue

            FROM
                "Customer_Job_Setup" cjs
                INNER JOIN "Customers" customer ON cjs.customer_id = customer.ID
                INNER JOIN "Customer_Farm" cf ON cjs.farm_id = cf.id AND cf.is_deleted = FALSE
                INNER JOIN "Crops" crop ON cjs.crop_id = crop.ID
                INNER JOIN "Hauling_Rates" hr ON cjs.customer_id = hr.customer_id AND cjs.farm_id = hr.farm_id AND cjs.crop_id = hr.crop_id AND hr.is_deleted = FALSE

            WHERE
                cjs.customer_id = '${customer_id}'
                AND cjs.is_job_completed = TRUE
        )
        SELECT
            *,
            revenue::NUMERIC / crop_acres::NUMERIC AS revenue_per_acre,
            revenue::NUMERIC / revenue_per_bushel::NUMERIC AS revenue_per_bushel
            
        FROM
            CTE_Hauling_Service;
        `;

        let query = `${getHarvestingServices} ${getHaulingServices}`;

        db.connect();

        let result = await db.query(query);

        let queryResp = {
            harvestingServices: result[0].rows,
            haulingServices: result[1].rows
        };

        db.end();

        const data = {
            harvestingServices: queryResp.harvestingServices,
            haulingServices: queryResp.haulingServices
        };

        // Create an object to store the sum of revenues for each crop
        const sumByCrop = {};

        // Calculate the sum for harvesting services
        for (const service of data.harvestingServices) {
            const cropId = service.crop_id;
            const revenue = Number(service.revenue);  // Ensuring number type
            const revenuePerAcre = Number(service.revenue_per_acre);  // Ensuring number type
            const revenuePerBushel = Number(service.revenue_per_bushel);  // Ensuring number type

            if (!sumByCrop[cropId]) {
                sumByCrop[cropId] = {
                    "crop_name": service.crop_name,
                    "total_revenue": 0,
                    "total_revenue_per_acre": 0,
                    "total_revenue_per_bushel": 0
                };
            }

            sumByCrop[cropId].total_revenue += revenue;
            sumByCrop[cropId].total_revenue_per_acre += revenuePerAcre;
            sumByCrop[cropId].total_revenue_per_bushel += revenuePerBushel;
        }

        // Calculate the sum for hauling services
        for (const service of data.haulingServices) {
            const cropId = service.crop_id;
            const revenue = Number(service.revenue);  // Ensuring number type
            const revenuePerAcre = Number(service.revenue_per_acre);  // Ensuring number type
            const revenuePerBushel = Number(service.revenue_per_bushel);  // Ensuring number type

            if (!sumByCrop[cropId]) {
                sumByCrop[cropId] = {
                    "crop_name": service.crop_name,
                    "total_revenue": 0,
                    "total_revenue_per_acre": 0,
                    "total_revenue_per_bushel": 0
                };
            }

            sumByCrop[cropId].total_revenue += revenue;
            sumByCrop[cropId].total_revenue_per_acre += revenuePerAcre;
            sumByCrop[cropId].total_revenue_per_bushel += revenuePerBushel;
        }

        // Convert the sumByCrop object to an array for easier handling
        const sumByCropArray = Object.keys(sumByCrop).map(cropId => {
            return {
                "crop_id": cropId,
                "crop_name": sumByCrop[cropId].crop_name,
                "total_revenue": sumByCrop[cropId].total_revenue,
                "total_revenue_per_acre": sumByCrop[cropId].total_revenue_per_acre,
                "total_revenue_per_bushel": sumByCrop[cropId].total_revenue_per_bushel
            };
        });

        let resp = {
            harvestingServices: queryResp.harvestingServices,
            haulingServices: queryResp.haulingServices,
            totalByCrop: sumByCropArray
        }

        context.res = {
            status: 200,
            body: resp,
        };

        context.done();
        return;
    } catch (err) {
        db.end();
        context.res = {
            status: 500,
            body: err,
        };
        context.done();
        return;
    }
};

export default httpTrigger;
