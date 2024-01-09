import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingGrossMargin, getHaulingGrossMargin } from "./grossMarginsFunctions";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const customer_id = req.query.customer_id;

    try {

        let query = `
        SELECT 
                invoiced_job_number,
                farm,
                crop,
                (net_pounds/2000)::FLOAT/acres::FLOAT AS tons_per_acre,
                bushel_weight AS bu_weight,
                (net_pounds/bushel_weight)::FLOAT/acres::FLOAT AS bushels_per_acre,
                (acres:: FLOAT * combining_rate:: FLOAT) / combine_sh AS harvesting_rev_per_separate_hour,
                hauling_revenue/total_loaded_dht_miles AS hauling_rev_loaded_mile,
                ((acres:: FLOAT * combining_rate:: FLOAT) / combine_sh) / combine_labor AS harvesting_rev_combine_labor,
                hauling_revenue/truck_driver_labor AS hauling_rev_truck_driver_labor,
                acres::FLOAT/combine_sh::FLOAT AS acres_per_seperator_hour,
                combine_labor,
                cart_operator_labor,
                truck_driver_labor
						
                FROM(
					SELECT 
						
            invoiced_job_number AS invoiced_job_number,
            created_at,
            crop,
            acres,
            bushel_weight,
            rate_type,
            rate,
            premium_rate,
            base_bushels,
            base_rate,
            job_id,
            farm,
            net_pounds,
            combining_rate,
            combine_sh,
            total_loaded_dht_miles,
            combine_labor,
            truck_driver_labor,
            cart_operator_labor,
						
        CASE
            WHEN rate_type = 'Bushels' 
                THEN ( calculate_weight(job_id) / bushel_weight) * rate
            WHEN rate_type = 'Bushels + Excess Yield' 
                THEN ( ( calculate_weight(job_id) / bushel_weight) * premium_rate ) + ( ( ( calculate_weight(job_id) /bushel_weight) - (acres::NUMERIC * base_bushels) ) * premium_rate )
            WHEN rate_type = 'Hundred Weight' 
                THEN (calculate_weight(job_id) / 100) * rate
            WHEN rate_type = 'Miles' 
                THEN (SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0)) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = job_id) * rate
            WHEN rate_type = 'Ton Miles'
                THEN (SELECT (premium_rate * (SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0))::FLOAT / COUNT(hdt.id)) + base_rate) * (calculate_weight(job_id) / 2000) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = job_id AND hdt.is_deleted = FALSE AND
                job_customer_id::VARCHAR = hr_customer::VARCHAR AND farm = hr_farm::VARCHAR AND crop = hr_crop::VARCHAR GROUP BY hdt.job_id)
            WHEN rate_type = 'Tons' 
                THEN (calculate_weight(job_id) / 2000) * rate
            WHEN rate_type = 'Load Count' 
                THEN (SELECT COUNT(hdt.id) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = job_id) * rate
        ELSE 0
            END AS hauling_revenue
						
   FROM (
       SELECT 
                job_setup_name AS invoiced_job_number,
                cjs.created_at,
                crop.name AS crop,
                cjs.crop_acres AS acres,
                crop.bushel_weight,
                hr.rate_type,
                hr.rate,
                hr.premium_rate,
                hr.base_bushels,
                hr.customer_id AS hr_customer,
                hr.base_rate,
                hr.farm_id hr_farm,
                hr.crop_id AS hr_crop,
                cjs.customer_id AS job_customer_id,
                cjs.id AS job_id,

                   (
                       Select name from "Customer_Farm"
                    
                       where id = cjs.farm_id AND is_deleted = FALSE
                    ) AS farm,
										
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
				) AS net_pounds,
				
				(
					Select combining_rate from "Combining_Rates"
					
					WHere customer_id = cjs.customer_id AND cjs.farm_id = farm_id AND cjs.crop_id = crop_id AND is_deleted = FALSE 
				) AS combining_rate,
				
				(
					Select SUM((dwr.ending_separator_hours::FLOAT)-(dwr.beginning_separator_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_sh,
				
				(
					Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
					WHERE hdt.job_id = cjs.id
				) AS total_loaded_dht_miles,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee	
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id 
					AND dwr_employee.role LIKE '%Combine Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS combine_labor,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600) as "hours_difference" from 
				    "DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS truck_driver_labor,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role NOT LIKE '%Cart Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS cart_operator_labor
				
       FROM 
           "Customer_Job_Setup" cjs
           INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE
   		INNER JOIN "Hauling_Rates" hr ON cjs.customer_id = hr.customer_id AND cjs.farm_id = hr.farm_id AND cjs.crop_id = hr.crop_id AND hr.is_deleted = FALSE

           WHERE cjs.customer_id = '${customer_id}'
   ) AS subquery
		) AS total ORDER BY created_at ASC;
      
        `;

        db.connect();

        let result = await db.query(query);

        let grossMarginHarvesting = getHarvestingGrossMargin(customer_id);
        let grossMarginHauling = getHaulingGrossMargin(customer_id);

        let query2 = `${grossMarginHarvesting} ${grossMarginHauling}`
        let result2 = await db.query(query2);

        let dataHarvesting = result2[0].rows;
        let dataHauling = result2[1].rows;

        const combinedMap = new Map();

        dataHarvesting.forEach(item => {
            const jobNumber = item.invoiced_job_number;
            if (!combinedMap.has(jobNumber)) {
                combinedMap.set(jobNumber, { ...item });
            } else {
                const combinedItem = combinedMap.get(jobNumber);
                combinedItem.revenue += item.revenue;
            }
        });

        dataHauling.forEach(item => {
            const jobNumber = item.invoiced_job_number;
            if (!combinedMap.has(jobNumber)) {
                combinedMap.set(jobNumber, { ...item });
            } else {
                const combinedItem = combinedMap.get(jobNumber);
                combinedItem.revenue += item.revenue;
            }
        });

        const revenuesByJobNumber = dataHarvesting.map(harvestingItem => {
            const haulingItem = dataHauling.find(item => item.invoiced_job_number === harvestingItem.invoiced_job_number);
            if (haulingItem) {
              return {
                ...harvestingItem,
                revenue: harvestingItem.revenue + haulingItem.revenue
              };
            }
            return harvestingItem;
          });

          let data = {
            data: result.rows,
            revenue: revenuesByJobNumber
          }

          const finalResult = data.data.map(item => {
            const revenueItem = data.revenue.find(rev => rev.invoiced_job_number === item.invoiced_job_number);
            if (revenueItem) {
              const totalLaborHours = (item.combine_labor || 0) + (item.cart_operator_labor || 0) + (item.truck_driver_labor || 0);
              const totalRevenuePerTotalLaborHours = totalLaborHours !== 0 ? revenueItem.revenue / totalLaborHours : 0;
          
              return {
                "invoiced_job_number": item.invoiced_job_number,
                "farm": item.farm,
                "crop": item.crop,
                "tons_per_acre": item.tons_per_acre,
                "bu_weight": item.bu_weight,
                "bushels_per_acre": item.bushels_per_acre,
                "harvesting_rev_per_separate_hour": item.harvesting_rev_per_separate_hour,
                "hauling_rev_loaded_mile": item.hauling_rev_loaded_mile,
                "harvesting_rev_combine_labor": item.harvesting_rev_combine_labor,
                "hauling_rev_truck_driver_labor": item.hauling_rev_truck_driver_labor,
                "acres_per_seperator_hour": item.acres_per_seperator_hour,
                "total_revenue_per_total_labor_hours": totalRevenuePerTotalLaborHours
              };
            }
            return null;
          }).filter(Boolean);

        let resp = {
           operationalJobMetrics: finalResult
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
