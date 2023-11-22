import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const db = new Client(config);

  try {
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;

    const customer_id: string = req.query.customer_id;
    const farms: string = req.query.farmsId;
    const crops: string = req.query.cropsId;
    const fields: string = req.query.field_id;
    const destinations_id: string = req.query.destinations_id;
    const created_at: string = req.query.created_at;
    const sort: string = req.query.sort ? req.query.sort : `load_Date`;
    const order: string = req.query.order ? req.query.order : `desc`;
    const from_date: string = req.query.from_date;
    const to_date: string = req.query.to_date;
    const status: string = req.query.status;
    const portalType: any = req.query.portal_type;
    const employee_id: any = req.query.employee_id;
    const trucking_company: any = req.query.trucking_company;

    let subQueryWhereClause: string = ` WHERE
    cj.is_deleted = FALSE 
    AND ht.is_deleted != TRUE
    AND cj.crop_acres IS NOT NULL 
    AND cj.crop_acres <> '' 
    AND ht.field_id IS NOT NULL
    `;

    if (customer_id) subQueryWhereClause = `${subQueryWhereClause} AND cj.customer_id = '${customer_id}'`;
    if (farms) subQueryWhereClause = `${subQueryWhereClause} AND cj.farm_id = '${farms}'`;
    if (fields) subQueryWhereClause = `${subQueryWhereClause} AND ht.field_id = '${fields}'`;
    if (crops) subQueryWhereClause = `${subQueryWhereClause} AND cj.crop_id = '${crops}'`;
    if (from_date && to_date) subQueryWhereClause = ` ${subQueryWhereClause} AND cj.created_at > '${from_date}' AND cj.created_at < '${to_date}'`;
    if (destinations_id) subQueryWhereClause = ` ${subQueryWhereClause} AND ht.destination_id = '${destinations_id}'`;
    if (trucking_company) subQueryWhereClause = ` ${subQueryWhereClause} AND ht.trucking_company = '${trucking_company}'`;

    // Total Bushel Weight where clause
    //     let totalBushelWeightWhereClause: string = ` WHERE
    // cj.is_deleted = FALSE
    // AND ht.is_deleted != TRUE
    // AND ht.scale_ticket_weight IS NOT NULL
    // AND ht.scale_ticket_weight <> ''`;

    // if (customer_id) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND cj.customer_id = '${customer_id}'`;
    // if (farms) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND cj.farm_id = '${farms}'`;
    // if (fields) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND ht.field_id = '${fields}'`;
    // if (crops) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND cj.crop_id = '${crops}'`;
    // if (from_date && to_date) totalBushelWeightWhereClause = ` ${totalBushelWeightWhereClause} AND cj.created_at > '${from_date}' AND cj.created_at < '${to_date}'`;
    // if (destinations_id) totalBushelWeightWhereClause = ` ${totalBushelWeightWhereClause} AND ht.destination_id = '${destinations_id}'`;

    //Farmers Tickets Where clause
    let farmersTicketsWhereClause: string = ` WHERE ht.farmers_bin_weight IS NOT NULL AND ht.farmers_bin_weight <> '' AND ht.field_id IS NOT NULL`;
    if (customer_id) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.customer_id = '${customer_id}' AND ht.is_deleted != TRUE`;
    if (farms) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.farm_id = '${farms}'`;
    if (fields) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.field_id = '${fields}'`;
    if (crops) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.crop_id = '${crops}'`;
    if (from_date && to_date) farmersTicketsWhereClause = ` ${farmersTicketsWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (destinations_id) farmersTicketsWhereClause = ` ${farmersTicketsWhereClause} AND ht.destination_id = '${destinations_id}'`;

    // Total Loads tickets
    let TotalLoadsTicketsWhereClause: string = ` WHERE ht.customer_id = '${customer_id}' AND ht.is_deleted != TRUE AND ht.field_id IS NOT NULL`;
    if (farms) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.farm_id = '${farms}'`;
    if (fields) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.field_id = '${fields}'`;
    if (crops) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.crop_id = '${crops}'`;
    if (from_date && to_date) TotalLoadsTicketsWhereClause = ` ${TotalLoadsTicketsWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (destinations_id) TotalLoadsTicketsWhereClause = ` ${TotalLoadsTicketsWhereClause} AND ht.destination_id = '${destinations_id}'`;
    if (trucking_company) TotalLoadsTicketsWhereClause = ` ${TotalLoadsTicketsWhereClause} AND ht.trucking_company = '${trucking_company}'`;

    let whereClause: string = ` Where ht.customer_id = '${customer_id}'
    AND ht.is_deleted != TRUE
    AND cj.is_deleted = FALSE
    AND field.is_deleted = FALSE
    AND cd.is_deleted = FALSE
    AND cc.is_deleted = FALSE
    AND ht.field_id IS NOT NULL
    `;

    if (portalType == 'employee-portal') {
      whereClause = `${whereClause}
      AND(ht.kart_operator_id = '${employee_id}' OR ht.truck_driver_id = '${employee_id}'
	    OR cj.crew_chief_id = '${employee_id}' OR cj.director_id = '${employee_id}')
      `
    }

    if (farms) whereClause = ` ${whereClause} AND cf."id" = '${farms}'`;
    if (crops) whereClause = ` ${whereClause} AND cc.id = '${crops}'`;
    if (created_at) whereClause = ` ${whereClause} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations_id) whereClause = ` ${whereClause} AND cd."id" = '${destinations_id}'`;
    if (fields) whereClause = ` ${whereClause} AND "field".ID = '${fields}'`;
    if (from_date && to_date) whereClause = ` ${whereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) whereClause = ` ${whereClause} AND ht.ticket_status = '${status}'`;

    let whereClauseJobs: string = `WHERE cj.customer_id = '${customer_id}'  AND cj.is_deleted = FALSE AND ht.is_deleted != TRUE AND ht.field_id IS NOT NULL`;

    if (farms) whereClauseJobs = ` ${whereClauseJobs} AND cf."id" = '${farms}'`;
    if (crops) whereClauseJobs = ` ${whereClauseJobs} AND cj.crop_id = '${crops}'`;
    if (created_at) whereClauseJobs = ` ${whereClauseJobs} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations_id) whereClauseJobs = ` ${whereClauseJobs} AND cd."id" = '${destinations_id}'`;
    if (fields) whereClauseJobs = ` ${whereClauseJobs} AND "field".ID = '${fields}'`;
    if (from_date && to_date) whereClauseJobs = ` ${whereClauseJobs} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) whereClauseJobs = ` ${whereClauseJobs} AND ht.ticket_status = '${status}'`;
    if (trucking_company) whereClauseJobs = ` ${whereClauseJobs} AND ht.trucking_company = '${trucking_company}'`;

    if (portalType == 'employee-portal') {
      whereClauseJobs = `${whereClauseJobs}
      AND(ht.kart_operator_id = '${employee_id}' OR ht.truck_driver_id = '${employee_id}'
	    OR cj.crew_chief_id = '${employee_id}' OR cj.director_id = '${employee_id}')
      `
    }

    //Loaded miles where clause
    // let loadMileswhereClause: string = ` Where ht.customer_id = '${customer_id}' AND ht.is_deleted != TRUE
    // AND ht.loaded_miles <> ''
    // AND ht.loaded_miles IS NOT NULL`;
    // if (farms) loadMileswhereClause = `${loadMileswhereClause} AND ht.farm_id = '${farms}'`;
    // if (fields) loadMileswhereClause = `${loadMileswhereClause} AND ht.field_id = '${fields}'`;
    // if (crops) loadMileswhereClause = `${loadMileswhereClause} AND ht.crop_id = '${crops}'`;
    // if (from_date && to_date) loadMileswhereClause = ` ${loadMileswhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    // if (destinations_id) loadMileswhereClause = ` ${loadMileswhereClause} AND ht.destination_id = '${destinations_id}'`;
    // if (from_date && to_date) loadMileswhereClause = ` ${loadMileswhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;

    //net pounds
    let netPoundswhereClause: string = ` Where ht.customer_id = '${customer_id}' AND ht.field_id IS NOT NULL`;

    if (farms) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.farm_id = '${farms}'`;
    if (fields) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.field_id = '${fields}'`;
    if (crops) netPoundswhereClause = `${netPoundswhereClause} AND ht.crop_id = '${crops}'`;
    if (from_date && to_date) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.ticket_status = '${status}'`;
    if (destinations_id) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.destination_id = '${destinations_id}'`;
    if (trucking_company) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.trucking_company = '${trucking_company}'`;

    let info_query = `
          
    SELECT
    cj."id",
    cj.job_setup_name,
    emp_cart.first_name || ' ' || emp_cart.last_name AS cart_operator_name,
		emp_truck.first_name || ' ' || emp_truck.last_name AS truck_driver_name,
		emp_crew_chief.first_name || ' ' || emp_crew_chief.last_name AS crew_cheif_name,
    ht.trucking_company,
    cj.farm_id AS farm_id,
    cj.crop_acres AS acres,
    cj.crop_gps_acres AS gps_acres,
    cj.crop_id AS crop_id,
    ht.id as "delivery_ticket_id",
    ht.delivery_ticket_name::TEXT AS ticket_name,
    ht.scale_ticket_number AS sl_number,
    ht.loaded_miles AS load_miles,
    ht.ticket_status AS status,

    CAST (
	  COALESCE (
		  CASE
				
				WHEN ht.farmers_bin_weight NOT IN ( '', '0', 'null' ) THEN
				ht.farmers_bin_weight 
			END,
		  
      CASE
				
				WHEN ht.scale_ticket_weight NOT IN ( '', '0', 'null' ) THEN
				ht.scale_ticket_weight 
				END,
			'0'
			) AS NUMERIC    ) AS net_pounds,	
  
    ht.created_at AS load_date,
    ht.protein_content AS protein,
    ht.moisture_content AS moisture,
    ht.test_weight,
    ht.field_id::TEXT,
    cd."id" AS destination_id,
    cf."name" AS farm_name,
    field."name" AS field_name,
    cd."name" AS destination,
    C.name AS crop_name,
    C.bushel_weight AS bushel_weight,
    emp_truck.guest_user_type

    FROM
    "Customer_Job_Setup" cj
    LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id" AND ht.is_deleted != TRUE
    LEFT JOIN "Customer_Farm" cf ON cj.farm_id = cf.ID AND cf.is_deleted = FALSE AND cf.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Field" field ON ht.field_id = field."id" AND field.is_deleted = FALSE AND field.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Destination" cd ON ht.destination_id = cd.ID AND cd.is_deleted = FALSE AND cd.customer_id = '${customer_id}'
    LEFT JOIN "Crops" C ON cj.crop_id = C."id"
    LEFT JOIN "Employees" emp_cart ON emp_cart.id = ht.kart_operator_id
		LEFT JOIN "Employees" emp_truck ON emp_truck.id = ht.truck_driver_id
		LEFT JOIN "Employees" emp_crew_chief ON emp_crew_chief.id = cj.crew_chief_id
    ${whereClauseJobs}

        
    UNION ALL

    SELECT
    cj."id",
    cj.job_setup_name,
    emp_cart.first_name || ' ' || emp_cart.last_name AS cart_operator_name,
		emp_truck.first_name || ' ' || emp_truck.last_name AS truck_driver_name,
		emp_crew_chief.first_name || ' ' || emp_crew_chief.last_name AS crew_cheif_name,
    ht.trucking_company,
    cj.farm_id AS farm_id,
    cj.crop_acres AS acres,
    cj.crop_gps_acres AS gps_acres,
    cj.crop_id AS crop_id,
    ht.id as "delivery_ticket_id",
    concat(ht.delivery_ticket_name, '-SL')::TEXT AS ticket_name,
    ht.scale_ticket_number AS sl_number,
    ht.loaded_miles AS load_miles,
    ht.ticket_status AS status,
    
    CASE
    WHEN NULLIF(NULLIF(ht.scale_ticket_weight, '')::NUMERIC, 0) IS NULL THEN 0
    ELSE CAST(NULLIF(NULLIF(ht.scale_ticket_weight, '')::NUMERIC, 0) AS NUMERIC)
    - COALESCE(NULLIF(NULLIF(ht.split_cart_scale_weight, '')::NUMERIC, 0), 0)
    END AS net_pounds,

    ht.created_at AS load_date,
    ht.protein_content AS protein,
    ht.moisture_content AS moisture,
    ht.test_weight,
    ht.split_field_id,
    cd."id" AS destination_id,
    cf."name" AS farm_name,
    field."name" AS field_name,
    cd."name" AS destination,
    C.name AS crop_name,
    C.bushel_weight AS bushel_weight,
    emp_truck.guest_user_type

        
        FROM
    "Customer_Job_Setup" cj
    LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id" AND ht.is_deleted != TRUE
    LEFT JOIN "Customer_Farm" cf ON cj.farm_id = cf.ID AND cf.is_deleted = FALSE AND cf.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Field" field ON CAST(ht.split_field_id AS UUID) = field."id" AND field.is_deleted = FALSE AND field.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Destination" cd ON ht.destination_id = cd.ID AND cd.is_deleted = FALSE AND cd.customer_id = '${customer_id}'
    LEFT JOIN "Crops" C ON cj.crop_id = C."id"
    LEFT JOIN "Employees" emp_cart ON emp_cart.id = ht.kart_operator_id
		LEFT JOIN "Employees" emp_truck ON emp_truck.id = ht.truck_driver_id
		LEFT JOIN "Employees" emp_crew_chief ON emp_crew_chief.id = cj.crew_chief_id
    ${whereClauseJobs}

    AND ht.split_load_check = TRUE

    ORDER BY 
              ${sort} ${order}

              OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
    ;
    `;

    let details_query = `
    SELECT DISTINCT
(
  SELECT 
  SUM(CAST(
    CASE
      WHEN ht.scale_ticket_weight = 'null' THEN 0
      ELSE ht.scale_ticket_weight::NUMERIC
    END AS NUMERIC
  )) AS total_net_pounds
FROM "Harvesting_Delivery_Ticket" ht
${netPoundswhereClause}
AND ht.is_deleted != TRUE
AND ht.scale_ticket_weight IS NOT NULL
AND ht.scale_ticket_weight <> '' 


) AS total_net_pounds,
(
  SELECT 
      SUM(net_pounds / NULLIF(bushel_weight, 0)) 
  FROM 
  (
      SELECT
    CASE
      WHEN COALESCE(NULLIF(ht.farmers_bin_weight, ''), NULLIF(ht.scale_ticket_weight, '')) = '' THEN 0
      ELSE
        CASE
          WHEN NULLIF(ht.farmers_bin_weight, '') IS NULL THEN 0
          ELSE CAST(COALESCE(NULLIF(ht.farmers_bin_weight, ''), NULLIF(ht.scale_ticket_weight, '')) AS NUMERIC)
        END
    END AS net_pounds,
          C.bushel_weight
      FROM "Customer_Job_Setup" cj, "Harvesting_Delivery_Ticket" ht, "Crops" C
      WHERE 
          ht.job_id = cj."id" 
          AND cj.crop_id = C."id" 
          AND cj.customer_id = '${customer_id}' 
          AND cj.is_deleted = FALSE 
          AND ht.is_deleted != TRUE
          AND ht.field_id IS NOT NULL

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
          AND ht.field_id IS NOT NULL
  ) AS CombinedResults
) AS total_net_bushels,

  (SELECT SUM(crop_acres) 
   FROM (
       SELECT DISTINCT ON (cj."id")
       CAST(NULLIF(cj.crop_acres, 'null') AS NUMERIC) as crop_acres
       FROM "Customer_Job_Setup" cj 
       LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"

      ${subQueryWhereClause}

) sub
  ) AS total_acres,
    (
    SELECT count(id) AS total_tickets
    from "Harvesting_Delivery_Ticket" ht 
    ${TotalLoadsTicketsWhereClause}
    ),

    (Select count(hdt.id) AS total_dht_loads 
		from "Harvesting_Delivery_Ticket" hdt
		LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
		WHERE hdt.customer_id = '${customer_id}' AND td.is_guest_user = FALSE
		),
		
		(Select count(hdt.id) AS total_customer_loads 
		from "Harvesting_Delivery_Ticket" hdt
		LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL
		LEFT JOIN "Customers" cust ON cust.id = hdt.customer_id AND cust.is_deleted != TRUE
		WHERE hdt.customer_id = '${customer_id}' AND td.is_guest_user = TRUE AND td.trucking_company = cust."customer_name"
		),

    (Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
		from "Harvesting_Delivery_Ticket" hdt
		LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL
		WHERE hdt.customer_id = '${customer_id}' AND td.is_guest_user = FALSE
		),
		
			(Select SUM(hdt.loaded_miles::FLOAT)/count(hdt.loaded_miles) AS dht_average_loaded_miles 
		from "Harvesting_Delivery_Ticket" hdt
		LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL
		WHERE hdt.customer_id = '${customer_id}' AND td.is_guest_user = FALSE
		)

FROM
"Customer_Job_Setup" cj
LEFT JOIN "Crops" cc ON cc."id" = uuid(cj.crop_id)
LEFT JOIN "Customer_Farm" cf ON cf."id" = cj.farm_id
LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"
LEFT JOIN "Customer_Field" field ON "field".ID = ht.field_id
LEFT JOIN "Customer_Destination" cd ON cd."name" = ht.destination
LEFT JOIN "Customers" customers ON customers."id" = ht.customer_id
  ${whereClause}

;
  `;

    let query = `${info_query} ${details_query}`;
    const filePath = 'query_test.txt';
    try {
      await fs.promises.writeFile(filePath, query);
      context.log(`Data written to file`);
    }
    catch (err) {
      context.log.error(`Error writing data to file: ${err}`);
    }
    db.connect();

    let result = await db.query(query);

    let resp = {
      harvestingJobs: result[0].rows,
      details: result[1].rows,
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
