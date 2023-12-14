import * as _ from "lodash";

export function getHarvestingExpenses() {

    let query = `
       SELECT 
            
           invoiced_job_number,
           farm,
           crop,
           combine_sh * combine_equipment_cost AS combine_equip,
           (combine_sh * combine_fuel_rate) * combine_fuel_cost AS combine_fuel,
           tractor_engine_hours * tractor_equipment_cost AS tractor_equip,
           (tractor_engine_hours * tractor_fuel_rate) * tractor_fuel_cost AS tractor_fuel,
           acres::FLOAT * header_cost AS header_equipment,
           tractor_engine_hours * grain_cart_equipment_cost AS grain_cart_equipment,
           employee_lodging_days::FLOAT * customer_lodging_rate::FLOAT AS employee_lodging_estimate
       
   FROM (
       SELECT 
                   job_setup_name AS invoiced_job_number,
                   cjs.created_at,
                   crop.name AS crop,
                   cjs.crop_acres AS acres,
   
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
                       Select combine_equipment_cost from "Cost_Operational_Data" LIMIT 1
                   ),
                   
                   (
                       Select combine_fuel_rate from "Cost_Operational_Data" LIMIT 1
                   ),
                   
                   (
                       SELECT combining_fuel_cost from "Combining_Rates"
                       where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
                   ) AS combine_fuel_cost,
                   
                   (
                       Select SUM((dwr.ending_engine_hours::FLOAT)-(dwr.beginning_engine_hours)::FLOAT) from 
                       "DWR" dwr
                       INNER JOIN "Machinery" tractor ON dwr.machinery_id = tractor."id" AND tractor."type" = 'Tractor'
                       
                       where dwr.job_id = cjs.id 
                   ) AS tractor_engine_hours,
                   
                   (
                       Select tractor_equipment_cost from "Cost_Operational_Data" LIMIT 1
                   ),
                   
                   (
                       Select tractor_fuel_rate from "Cost_Operational_Data" LIMIT 1
                   ),
                   
                   (
                       SELECT tractor_fuel_cost from "Combining_Rates"
                       where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
                   ) AS tractor_fuel_cost,
                   
                   (
                       Select header_cost from "Cost_Operational_Data" LIMIT 1
                   ),
                   
                   (
                       Select grain_cart_equipment_cost from "Cost_Operational_Data" LIMIT 1
                   ),
                   
                   (
                       Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600 / 24) as "days" from 
                       "DWR_Employees" dwr_employee
                       INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
                       INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role NOT LIKE '%Truck Driver%'
                       INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
                       
                       where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
                   ) AS employee_lodging_days,
   
                   (
                       Select customer_lodging_rate from "Customer_Cost_Operational_Data" LIMIT 1
                   )
   
               
       FROM 
           "Customer_Job_Setup" cjs
           INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE
   
   ) AS subquery ORDER BY created_at ASC;
      `;

    let quertInfo = `
      SELECT 
	
		SUM(combine_sh * combine_equipment_cost) AS combine_equip,
		SUM((combine_sh * combine_fuel_rate) * combine_fuel_cost) AS combine_fuel,
		SUM(tractor_engine_hours * tractor_equipment_cost) AS tractor_equip,
		SUM((tractor_engine_hours * tractor_fuel_rate) * tractor_fuel_cost) AS tractor_fuel,
		SUM(acres::FLOAT * header_cost) AS header_equipment,
		SUM(tractor_engine_hours * grain_cart_equipment_cost) AS grain_cart_equipment,
		SUM(employee_lodging_days::FLOAT * customer_lodging_rate::FLOAT) AS employee_lodging_estimate
	
FROM (
    SELECT 
        job_setup_name AS invoiced_job_number,
				cjs.created_at,
				cjs.crop_acres AS acres,
				
				(
					Select SUM((dwr.ending_separator_hours::FLOAT)-(dwr.beginning_separator_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_sh,
				
				(
					Select combine_equipment_cost from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select combine_fuel_rate from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					SELECT combining_fuel_cost from "Combining_Rates"
					where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
				) AS combine_fuel_cost,
				
				(
					Select SUM((dwr.ending_engine_hours::FLOAT)-(dwr.beginning_engine_hours)::FLOAT) from 
					"DWR" dwr
					INNER JOIN "Machinery" tractor ON dwr.machinery_id = tractor."id" AND tractor."type" = 'Tractor'
					
					where dwr.job_id = cjs.id 
				) AS tractor_engine_hours,
				
				(
					Select tractor_equipment_cost from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select tractor_fuel_rate from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					SELECT tractor_fuel_cost from "Combining_Rates"
					where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
				) AS tractor_fuel_cost,
				
				(
					Select header_cost from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select grain_cart_equipment_cost from "Cost_Operational_Data" LIMIT 1
				),
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600 / 24) as "days" from 
					"DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role NOT LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS employee_lodging_days,

				(
					Select customer_lodging_rate from "Customer_Cost_Operational_Data" LIMIT 1
				)

			
    FROM 
        "Customer_Job_Setup" cjs
		INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE

) AS subquery;
      `

    let mergedQuery = `${query} ${quertInfo}`;
    return mergedQuery;
}

export function getHaulingExpenses() {

    let query = `
    SELECT 
            
    invoiced_job_number,
    farm,
    crop,
    (total_loaded_dht_miles * 2) * truck_equipment_cost AS truck_equip,
    ((total_loaded_dht_miles * 2)/ hauling_fuel_cost) * truck_fuel_cost AS truck_fuel,
    truck_driver_lodging_days::FLOAT * customer_lodging_rate::FLOAT AS truck_driver_lodging_estimate

    FROM (
        SELECT 
            job_setup_name AS invoiced_job_number,
            cjs.created_at,
            crop.name AS crop,

            (
                Select name from "Customer_Farm"
                where id = cjs.farm_id AND is_deleted = FALSE
             ) AS farm,
                                 
            (
                Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
                from "Harvesting_Delivery_Ticket" hdt
                LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
                AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
                WHERE hdt.job_id = cjs.id
            ) AS total_loaded_dht_miles,
                                 
            (
                Select truck_equipment_cost from "Cost_Operational_Data" LIMIT 1
            ),
                                 
            (
                SELECT hauling_fuel_cost from "Hauling_Rates" 
                where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
            ) AS hauling_fuel_cost,
                                 
            (
                SELECT truck_fuel_cost from "Hauling_Rates" 
                where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
            ) AS truck_fuel_cost,
                                 
            (
                Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600 / 24) as "days" from 
                "DWR_Employees" dwr_employee
                INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
                INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role LIKE '%Truck Driver%'
                INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
                                     
                where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
            ) AS truck_driver_lodging_days,
                                 
            (
                Select customer_lodging_rate from "Customer_Cost_Operational_Data" LIMIT 1
            )
           
    FROM 
        "Customer_Job_Setup" cjs
        INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE

) AS subquery ORDER BY created_at ASC;
      `;

    let quertInfo = `
        SELECT 
        SUM((total_loaded_dht_miles * 2) * truck_equipment_cost) AS truck_equip,
        SUM(((total_loaded_dht_miles * 2)/ hauling_fuel_cost) * truck_fuel_cost) AS truck_fuel,
        SUM(truck_driver_lodging_days::FLOAT * customer_lodging_rate::FLOAT) AS truck_driver_lodging_estimate

        FROM (
            SELECT 
 
                cjs.created_at,
                       
                (
                    Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
                    from "Harvesting_Delivery_Ticket" hdt
                    LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
                    AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
                    WHERE hdt.job_id = cjs.id
                ) AS total_loaded_dht_miles,
                       
                (
                    Select truck_equipment_cost from "Cost_Operational_Data" LIMIT 1
                ),
                       
                (
                    SELECT hauling_fuel_cost from "Hauling_Rates" 
                    where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
                ) AS hauling_fuel_cost,
                       
                (
                    SELECT truck_fuel_cost from "Hauling_Rates" 
                    where customer_id = cjs.customer_id AND farm_id = cjs.farm_id AND crop_id = cjs.crop_id
                ) AS truck_fuel_cost,
                       
                (
                    Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600 / 24) as "days" from 
                    "DWR_Employees" dwr_employee
                    INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
                    INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role LIKE '%Truck Driver%'
                    INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
                           
                    where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
                ) AS truck_driver_lodging_days,
                       
                (
                    Select customer_lodging_rate from "Customer_Cost_Operational_Data" LIMIT 1
                )
 
        FROM 
        "Customer_Job_Setup" cjs
        INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE

    ) AS subquery ;
      `

    let mergedQuery = `${query} ${quertInfo}`;
    return mergedQuery;
}