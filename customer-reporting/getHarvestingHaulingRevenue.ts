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
        cr.combining_rate AS rate,
        (cjs.crop_acres::float * cr.combining_rate::float) AS revenue,
        (cjs.crop_acres::float * cr.combining_rate::float)/cjs.crop_acres::float AS revenue_per_acre
        
        
        from
        
        "Customer_Job_Setup" cjs
        INNER JOIN "Customers" customer ON cjs.customer_id = customer."id"
        INNER JOIN "Customer_Farm" cf ON cjs.farm_id = cf."id" AND cf.is_deleted = FALSE 
        INNER JOIN "Crops" crop ON cjs.crop_id = crop."id"
        INNER JOIN "Combining_Rates" cr ON cr.customer_id = cjs.customer_id  AND cr.is_deleted = FALSE 
        -- AND cjs.farm_id = cr.farm_id AND cjs.crop_id = cr.crop_id
        
        where cjs.customer_id = '${customer_id}' AND cjs.is_job_completed = TRUE
        ;`;

        let getHaulingServices = `
        Select 
        
        customer.id AS customer_id,
        customer.customer_name AS customer_name,
        cjs.job_setup_name AS job_name,
        cjs.farm_id AS farm_id,
        cf."name" AS farm_name,
        crop.id AS crop_id,
        crop."name" AS crop_name,
        hr.rate_type AS rate_type,
        cjs.crop_acres AS quantity,
        hr.rate AS rate,
        (cjs.crop_acres::float * hr.rate::float) AS revenue,
        (cjs.crop_acres::float * hr.rate::float)/cjs.crop_acres::float AS revenue_per_acre
        
        
        from
        
        "Customer_Job_Setup" cjs
        INNER JOIN "Customers" customer ON cjs.customer_id = customer."id"
        INNER JOIN "Customer_Farm" cf ON cjs.farm_id = cf."id" AND cf.is_deleted = FALSE 
        INNER JOIN "Crops" crop ON cjs.crop_id = crop."id"
        INNER JOIN "Hauling_Rates" hr ON cjs.customer_id = hr.customer_id AND hr.is_deleted = FALSE
        
        
        where cjs.customer_id = '${customer_id}' AND cjs.is_job_completed = TRUE
        ;`;

        let getTotalByCrop = `
        SELECT
            combined_result.crop_id,
            combined_result.crop_name,
            SUM ( combined_result.revenue ) AS total_revenue,
            SUM ( combined_result.revenue_per_acre ) AS total_revenue_per_acre 
        FROM
            (
            SELECT
                customer_id,
                crop_id,
                crop_name,
                SUM ( revenue ) AS revenue,
                SUM ( revenue_per_acre ) AS revenue_per_acre 
            FROM
                (-- First query
                SELECT
                    customer.ID AS customer_id,
                    crop.ID AS crop_id,
                    crop."name" AS crop_name,
                    SUM ( ( cjs.crop_acres :: FLOAT * cr.combining_rate :: FLOAT ) ) AS revenue,
                    SUM ( ( cjs.crop_acres :: FLOAT * cr.combining_rate :: FLOAT ) / cjs.crop_acres :: FLOAT ) AS revenue_per_acre 
                FROM
                    "Customer_Job_Setup" cjs
                    INNER JOIN "Customers" customer ON cjs.customer_id = customer."id"
                    INNER JOIN "Crops" crop ON cjs.crop_id = crop."id"
                    INNER JOIN "Combining_Rates" cr ON cr.customer_id = cjs.customer_id 
                    AND cr.is_deleted = FALSE 
                WHERE
                    cjs.customer_id = '${customer_id}' AND cjs.is_job_completed = TRUE
                GROUP BY
                    customer.ID,
                    crop.ID,
                    crop."name" UNION-- Second query
                SELECT
                    customer.ID AS customer_id,
                    crop.ID AS crop_id,
                    crop."name" AS crop_name,
                    SUM ( ( cjs.crop_acres :: FLOAT * hr.rate :: FLOAT ) ) AS revenue,
                    SUM ( ( cjs.crop_acres :: FLOAT * hr.rate :: FLOAT ) / cjs.crop_acres :: FLOAT ) AS revenue_per_acre 
                FROM
                    "Customer_Job_Setup" cjs
                    INNER JOIN "Customers" customer ON cjs.customer_id = customer."id"
                    INNER JOIN "Crops" crop ON cjs.crop_id = crop."id"
                    INNER JOIN "Hauling_Rates" hr ON cjs.customer_id = hr.customer_id 
                    AND hr.is_deleted = FALSE 
                WHERE
                    cjs.customer_id = '${customer_id}' AND cjs.is_job_completed = TRUE
                GROUP BY
                    customer.ID,
                    crop.ID,
                    crop."name" 
                ) AS revenue_data 
            GROUP BY
                customer_id,
                crop_id,
                crop_name 
            ) AS combined_result 
        GROUP BY
            combined_result.crop_id,
            combined_result.crop_name
        ;`

        let query = `${getHarvestingServices} ${getHaulingServices} ${getTotalByCrop}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            harvestingServices: result[0].rows,
            haulingServices: result[1].rows,
            totalByCrop: result[2].rows
        };

        db.end();

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
