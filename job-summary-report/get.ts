import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {

        let query = `
        SELECT 
        
		invoiced_job_number,
		customer_name,
		created_at ::DATE AS job_created_date,
		modified_at ::DATE AS job_closed_out_date,
		modified_at::DATE - created_at::DATE AS total_days,
		state,
		crew_chief,
		director_name,
		farm AS farm_name,
		crop_name,
		crop_acres AS acres,
		combining_rate AS harvesting_rate,
		hauling_rate,
		rate_type AS hauling_rate_type,
		total_dht_loads AS dht_load_count,
		dht_total_loaded_miles AS total_miles,
		dht_average_loaded_miles AS avg_loaded_miles,
		total_net_pounds AS pounds,
		bushel_weight,
		total_net_pounds / bushel_weight AS bushels,
		combining_rate::FLOAT * crop_acres::FLOAT AS harvesting_revenue,
		hauling_rate::FLOAT * crop_acres::FLOAT AS hauling_revenue,
		(combining_rate::FLOAT * crop_acres::FLOAT) + (hauling_rate::FLOAT * crop_acres::FLOAT) AS total_revenue
		
FROM (
    SELECT 
				job_setup_name AS invoiced_job_number,
				cjs.created_at,
				cjs.modified_at,
				cjs."state",
				concat(crew.first_name, ' ', crew.last_name) AS crew_chief,
				concat(director.first_name, ' ', director.last_name) AS director_name,
				crop."name" AS crop_name,
				cjs.crop_acres,
				cr.combining_rate,
				hr.rate AS hauling_rate,
				hr.rate_type,
				crop.bushel_weight,

 				(
					Select customer_name from "Customers" 
 				
					where id = cjs.customer_id AND is_deleted = FALSE
 				) AS customer_name,
				
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm,
				
				(
					Select count(hdt.id) AS total_dht_loads 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					WHERE td.is_guest_user = FALSE AND hdt.job_id = cjs.id
				),
				
				(	
					Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL
					WHERE td.is_guest_user = FALSE AND hdt.job_id = cjs.id
				),
			
				(	
					Select SUM(hdt.loaded_miles::FLOAT)/count(hdt.loaded_miles) AS dht_average_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL
					WHERE td.is_guest_user = FALSE AND hdt.job_id = cjs.id
				),
				
				(
					SELECT SUM(CAST(
					CASE
						WHEN ht.scale_ticket_weight = 'null' THEN 0 ELSE ht.scale_ticket_weight::NUMERIC END AS NUMERIC )) AS total_net_pounds
					FROM "Harvesting_Delivery_Ticket" ht
					WHERE  ht.field_id IS NOT NULL
					AND ht.is_deleted != TRUE
					AND ht.scale_ticket_weight IS NOT NULL
					AND ht.scale_ticket_weight <> '' 
					AND ht.job_id = cjs."id"
				) AS total_net_pounds
		
			
    FROM 
        "Customer_Job_Setup" cjs
				INNER JOIN "Employees" crew ON crew.id = cjs.crew_chief_id AND crew.is_deleted = FALSE
				INNER JOIN "Employees" director ON director."id" = cjs.director_id AND director.is_deleted = FALSE
				INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE
				INNER JOIN "Combining_Rates" cr ON cjs.crop_id = cr.crop_id AND cjs.customer_id = cr.customer_id AND cr.is_deleted = FALSE
				INNER JOIN "Hauling_Rates" hr ON cjs.crop_id = hr.crop_id AND cjs.customer_id = hr.customer_id

		WHERE cjs.customer_id = '460d26b1-4eca-4579-94a5-b18d728f4199'

) AS subquery ORDER BY created_at ASC;

        `;

        db.connect();

        let result = await db.query(query);

        let resp = {
            data: result.rows
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
