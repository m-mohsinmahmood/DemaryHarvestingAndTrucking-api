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
        const year: string = req.query.year;
        let job_results: any = req.query.job_results;
        let jobSetupNames: string = '';

        // Extracting job setup names from the array
        if (job_results && job_results.length > 0) {
            job_results = JSON.parse(req.query.job_results);
            jobSetupNames = job_results.map(job => `'${job.job_setup_name}'`).join(',');
        }

        let whereClause: string = ``;

        if (year) whereClause = ` ${whereClause} AND EXTRACT(YEAR from cjs.created_at) = '${year}'`;
        if (job_results) whereClause = ` ${whereClause} AND cjs.job_setup_name IN (${jobSetupNames})`;

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
                cjs.crop_acres::FLOAT AS quantity,
                cjs.crop_acres AS crop_acres,
                cr.combining_rate AS rate,
                (cjs.crop_acres::float * cr.combining_rate::float) AS revenue,
                (cjs.crop_acres::float * cr.combining_rate::float)/cjs.crop_acres::float AS revenue_per_acre,
                calculate_weight(cjs.id) / crop.bushel_weight AS total_bushels,
                cjs.created_at

                from
                
                    "Customer_Job_Setup" cjs
                    INNER JOIN "Customers" customer ON cjs.customer_id = customer."id"
                    INNER JOIN "Customer_Farm" cf ON cjs.farm_id = cf."id" AND cf.is_deleted = FALSE 
                    INNER JOIN "Crops" crop ON cjs.crop_id = crop."id"
                    INNER JOIN "Combining_Rates" cr ON cr.customer_id = cjs.customer_id AND cjs.farm_id = cr.farm_id AND cjs.crop_id = cr.crop_id AND cr.is_deleted = FALSE 
                
                where 
                    cjs.customer_id = '${customer_id}'
                    ${whereClause}
        ),

        Aggregated AS (
            SELECT
                farm_id,
                crop_id,
                ARRAY_AGG(job_name) AS job_name,
                (ARRAY_AGG(customer_id))[1] AS customer_id,
                (ARRAY_AGG(customer_name))[1] AS customer_name,
                (ARRAY_AGG(farm_name))[1] AS farm_name,
                (ARRAY_AGG(crop_name))[1] AS crop_name,
                (ARRAY_AGG(rate_type))[1] AS rate_type,
                MIN(quantity) AS quantity,
                MIN(crop_acres) AS crop_acres,
                MIN(rate) AS rate,
                MIN(revenue) AS revenue,
                MIN(revenue_per_acre) AS revenue_per_acre,
                MIN(total_bushels) AS total_bushels,
                created_at
            FROM
                CTE_Harvesting_Service
            GROUP BY
                farm_id,
                crop_id,
                created_at
        )
        
        SELECT
            a.customer_id,
            a.customer_name,
            a.job_name,
            a.farm_id,
            a.farm_name,
            a.crop_id,
            a.crop_name,
            a.rate_type,
            a.quantity,
            a.crop_acres,
            a.rate,
            a.revenue,
            a.revenue_per_acre,
            a.total_bushels,
            a.revenue::NUMERIC / NULLIF(a.crop_acres::NUMERIC,0)::NUMERIC AS revenue_per_acre,
            a.revenue::NUMERIC / NULLIF(a.total_bushels::NUMERIC,0)::NUMERIC AS revenue_per_bushel
        FROM
        Aggregated a ORDER BY a.created_at ASC;
        `;

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
                calculate_weight(cjs.id) / crop.bushel_weight AS total_bushels,
                cjs.created_at,
                CASE
                    WHEN hr.rate_type = 'Bushels' THEN calculate_weight(cjs.id) / crop.bushel_weight
                    WHEN hr.rate_type = 'Bushels + Excess Yield' THEN ( calculate_weight(cjs.id) / crop.bushel_weight) + ((calculate_weight(cjs.id) / crop.bushel_weight) - (cjs.crop_acres::NUMERIC * hr.base_bushels))
                     WHEN hr.rate_type = 'Hundred Weight' THEN calculate_weight(cjs.id) / 100
                     WHEN hr.rate_type = 'Miles' THEN (SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0)) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id)
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
                     WHEN hr.rate_type = 'Miles' THEN (SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0)) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id) * hr.rate
                     WHEN hr.rate_type = 'Ton Miles' THEN (SELECT ((hr.premium_rate * (SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0))::FLOAT / COUNT(hdt.id))) + hr.base_rate) * (calculate_weight(cjs.id) / 2000) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = cjs.id AND hdt.is_deleted = FALSE)
                     when hr.rate_type = 'Tons' then (calculate_weight(cjs.id) / 2000) * hr.rate
                    when hr.rate_type = 'Load count' then (select count(hdt.id) from "Harvesting_Delivery_Ticket" hdt where hdt.job_id = cjs.id) * hr.rate
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
                ${whereClause}
                )
                SELECT
                    *,
                    revenue::NUMERIC / crop_acres::NUMERIC AS revenue_per_acre,
                    revenue::NUMERIC / total_bushels::NUMERIC AS revenue_per_bushel
                    
                FROM
                    CTE_Hauling_Service;
        `;

        let total_bushels_query = `
        SELECT 
            SUM(net_pounds / NULLIF(bushel_weight, 0)) AS total_net_bushels
        FROM 
        (
            SELECT
                CAST ( COALESCE ( NULLIF ( ht.farmers_bin_weight, '' ), NULLIF ( ht.scale_ticket_weight, '' ) ) AS NUMERIC ) AS net_pounds,
                C.bushel_weight
            FROM "Customer_Job_Setup" cj, "Harvesting_Delivery_Ticket" ht, "Crops" C
            WHERE 
                ht.job_id = cj."id" 
                AND cj.crop_id = C."id" 
                AND cj.customer_id = '${customer_id}' 
                AND cj.is_deleted = FALSE 
                AND ht.is_deleted != TRUE
            UNION ALL
            SELECT
                CAST ( COALESCE ( NULLIF ( ht.scale_ticket_weight, '' ), '0' ) AS NUMERIC ) - CAST ( COALESCE ( NULLIF ( ht.split_cart_scale_weight, '' ), '0' ) AS NUMERIC ) AS net_pounds,
                C.bushel_weight
            FROM "Customer_Job_Setup" cj, "Harvesting_Delivery_Ticket" ht, "Crops" C
            WHERE 
                ht.job_id = cj."id" 
                AND cj.crop_id = C."id" 
                AND cj.customer_id = '${customer_id}' 
                AND cj.is_deleted = FALSE 
                AND ht.is_deleted != TRUE 
                AND ht.split_load_check = TRUE
        ) AS CombinedResults;`

        let total_acres_query = `
        SELECT SUM(crop_acres) AS total_acres
        FROM (
            SELECT DISTINCT ON (cj."id")
                CASE 
                    WHEN TRIM(cj.crop_acres) = '' THEN 0
                    ELSE CAST(cj.crop_acres AS NUMERIC)
                END as crop_acres
            FROM "Customer_Job_Setup" cj 
                WHERE cj.is_deleted = FALSE AND cj.customer_id = '${customer_id}'
        ) sub;`;

        let query = `${getHarvestingServices} ${getHaulingServices} ${total_bushels_query} ${total_acres_query}`;

        db.connect();

        let result = await db.query(query);

        let queryResp = {
            harvestingServices: result[0].rows,
            haulingServices: result[1].rows,
            totalBushels: result[2].rows[0].total_net_bushels,
            totalAcres: result[3].rows[0].total_acres
        };

        db.end();

        const data = {
            harvestingServices: queryResp.harvestingServices,
            haulingServices: queryResp.haulingServices
        };

        //#region Revenue by Crops
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
                "total_revenue": +sumByCrop[cropId].total_revenue,
                "total_revenue_per_acre": +sumByCrop[cropId].total_revenue_per_acre,
                "total_revenue_per_bushel": +sumByCrop[cropId].total_revenue_per_bushel
            };
        });
        //#endregion

        //#region Revenue by Jobs
        const sumByJob = {};

        function calculateServiceSum(service, sumObject) {
            const jobName = service.job_name;
            const revenue = Number(service.revenue);
            const revenuePerAcre = Number(service.revenue_per_acre);
            const revenuePerBushel = Number(service.revenue_per_bushel);

            if (!sumObject[jobName]) {
                sumObject[jobName] = {
                    "job_name": service.job_name, // Assuming each service has a job_name associated with its job_id
                    "total_revenue": 0,
                    "total_revenue_per_acre": 0,
                    "total_revenue_per_bushel": 0
                };
            }

            sumObject[jobName].total_revenue += revenue;
            sumObject[jobName].total_revenue_per_acre += revenuePerAcre;
            sumObject[jobName].total_revenue_per_bushel += revenuePerBushel;
        }

        // Calculate the sum for harvesting services
        for (const service of data.harvestingServices) {
            calculateServiceSum(service, sumByJob);
        }

        // Calculate the sum for hauling services
        for (const service of data.haulingServices) {
            calculateServiceSum(service, sumByJob);
        }

        // Convert the sumByJob object to an array for easier handling
        const sumByJobArray = Object.keys(sumByJob).map(jobId => {
            return {
                "job_name": sumByJob[jobId].job_name,
                "total_revenue": sumByJob[jobId].total_revenue,
                "total_revenue_per_acre": sumByJob[jobId].total_revenue_per_acre,
                "total_revenue_per_bushel": sumByJob[jobId].total_revenue_per_bushel
            };
        });
        //#endregion


        let resp = {
            harvestingServices: queryResp.harvestingServices,
            haulingServices: queryResp.haulingServices,
            totalByCrop: sumByCropArray,
            totalByJob: sumByJobArray,
            totalBushels: queryResp.totalBushels,
            totalAcres: queryResp.totalAcres
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