import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const db = new Client(config);

	const customer_id = req.query.customer_id;

	try {
		let info_query = `
        SELECT 
        
        invoiced_job_number,
        customer_name,
		farm,
		crop,
		combine_sh,
		combine_eh,
		combine_sh * combine_fuel_rate AS combine_fuel,
		combine_labor,
		tractor_engine_hours,
		tractor_engine_hours * tractor_fuel_rate AS tractor_fuel,
		cart_operator_labor,
        total_loaded_dht_miles,
        dht_avg_loaded_miles,
		total_loaded_dht_miles * 2 AS total_roundtrip_dht_miles,
		(total_loaded_dht_miles * 2)/ hauling_fuel_cost AS estimated_truck_fuel,
		truck_driver_labor,
		employee_lodging_days,
		truck_driver_lodging_days,
		total_net_pounds/bushel_weight AS bushels,
		crop_acres,
		total_net_pounds
FROM (
    SELECT 
                job_setup_name AS invoiced_job_number,
				cjs.created_at,
				crop.bushel_weight,
				cjs.crop_acres,
				crop.name AS crop,
				
 				(
					Select customer_name from "Customers" 
 				
					where id = cjs.customer_id AND is_deleted = FALSE
 				) AS customer_name,
				
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm,
				
				
				(
					Select SUM((dwr.ending_separator_hours::FLOAT)-(dwr.beginning_separator_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_sh,
				
				(
					Select SUM((dwr.ending_engine_hours::FLOAT)-(dwr.beginning_engine_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_eh,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."ending_day" - dwr_employee."begining_day")) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee	
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id 
					AND dwr_employee.role LIKE '%Combine Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS combine_labor,
				
				(
					Select combine_fuel_rate from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select tractor_fuel_rate from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select SUM((dwr.ending_engine_hours::FLOAT)-(dwr.beginning_engine_hours)::FLOAT) from 
					"DWR" dwr
					INNER JOIN "Machinery" tractor ON dwr.machinery_id = tractor."id" AND tractor."type" = 'Tractor'
					
					where dwr.job_id = cjs.id 
				) AS tractor_engine_hours,

				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee.ending_day - dwr_employee.begining_day)) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role LIKE '%Cart Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS cart_operator_labor,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."ending_day" - dwr_employee."begining_day")) / 3600) as "hours_difference" from 
				    "DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS truck_driver_labor,
				
				(
					SELECT
						CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as "result"
					FROM
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role NOT LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS employee_lodging_days,
				
				(
					SELECT
						CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as "result"
					FROM
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS truck_driver_lodging_days,
     
				(
					Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
					WHERE hdt.job_id = cjs.id
				) AS total_loaded_dht_miles,
				
				(
					Select SUM(hdt.loaded_miles::FLOAT)/count(hdt.loaded_miles) AS dht_average_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE 
					AND hdt.field_id IS NOT NULL AND hdt.		loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
					WHERE hdt.job_id = cjs.id 
				) AS dht_avg_loaded_miles,
				
				(
					SELECT hauling_fuel_cost from "Hauling_Rates" 
					where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id AND is_deleted = FALSE
				) AS hauling_fuel_cost,
				
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
		INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE

		WHERE cjs.customer_id = '${customer_id}'

) AS subquery ORDER BY created_at ASC;

      `;

		let subTotals = `
      SELECT 

		SUM(combine_sh) AS combine_sh,
		SUM(combine_eh) AS combine_eh,
		SUM(combine_sh * combine_fuel_rate) AS combine_fuel,
		SUM(combine_labor) AS combine_labor,
		SUM(tractor_engine_hours) AS tractor_engine_hours,
		SUM(tractor_engine_hours * tractor_fuel_rate) AS tractor_fuel,
		SUM(cart_operator_labor) AS cart_operator_labor,
        SUM(total_loaded_dht_miles) AS total_loaded_dht_miles,
		SUM(total_loaded_dht_miles * 2) AS total_roundtrip_dht_miles,
		SUM((total_loaded_dht_miles * 2)/ hauling_fuel_cost) AS estimated_truck_fuel,
		SUM(truck_driver_labor) AS truck_driver_labor,
		SUM(employee_lodging_days) AS employee_lodging_days ,
		SUM(truck_driver_lodging_days) AS truck_driver_lodging_days,
		SUM(total_net_pounds/bushel_weight) AS bushels,
		SUM(crop_acres::FLOAT) AS crop_acres,
		SUM(total_net_pounds) AS total_net_pounds
	
FROM (
    SELECT 
        job_setup_name AS invoiced_job_number,
				cjs.created_at,
				crop.bushel_weight,
				cjs.crop_acres,
				crop.name AS crop,
				
 				(
					Select customer_name from "Customers" 
 				
					where id = cjs.customer_id AND is_deleted = FALSE
 				) AS customer_name,
				
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm,
				
				
				(
					Select SUM((dwr.ending_separator_hours::FLOAT)-(dwr.beginning_separator_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_sh,
				
				(
					Select SUM((dwr.ending_engine_hours::FLOAT)-(dwr.beginning_engine_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_eh,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."ending_day" - dwr_employee."begining_day")) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee	
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id 
					AND dwr_employee.role LIKE '%Combine Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS combine_labor,
				
				(
					Select combine_fuel_rate from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select tractor_fuel_rate from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select SUM((dwr.ending_engine_hours::FLOAT)-(dwr.beginning_engine_hours)::FLOAT) from 
					"DWR" dwr
					INNER JOIN "Machinery" tractor ON dwr.machinery_id = tractor."id" AND tractor."type" = 'Tractor'
					
					where dwr.job_id = cjs.id 
				) AS tractor_engine_hours,

				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee.ending_day - dwr_employee.begining_day)) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role LIKE '%Cart Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS cart_operator_labor,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."ending_day" - dwr_employee."begining_day")) / 3600) as "hours_difference" from 
				    "DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS truck_driver_labor,
				
				(
					SELECT
						CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as "result"
					FROM
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role NOT LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS employee_lodging_days,
				
				(
					SELECT
						CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as "result"
					FROM
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr_employee.role LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS truck_driver_lodging_days,
     
				(
					Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
					WHERE hdt.job_id = cjs.id
				) AS total_loaded_dht_miles,
				
				(
					Select SUM(hdt.loaded_miles::FLOAT)/count(hdt.loaded_miles) AS dht_average_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE 
					AND hdt.field_id IS NOT NULL AND hdt.		loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
					WHERE hdt.job_id = cjs.id 
				) AS dht_avg_loaded_miles,
				
				(
					SELECT hauling_fuel_cost from "Hauling_Rates" 
					where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id AND is_deleted = FALSE
				) AS hauling_fuel_cost,
				
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
		INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE

		WHERE cjs.customer_id = '${customer_id}'
) AS subquery;
      `;

		let query = `${info_query} ${subTotals}`;
	
		db.connect();

		let result = await db.query(query);

		let resp = {
			data: result[0].rows,
			subTotals: result[1].rows
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
