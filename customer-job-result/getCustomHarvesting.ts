import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);


  try {
    const customer_id: string = req.query.customer_id;
    const farms: string = req.query.farmsId;
    const crops: string = req.query.cropsId;
    const fields: string = req.query.field_id;
    const destinations_id: string = req.query.destinations_id;
    const created_at: string = req.query.created_at;
    const sort: string = req.query.sort ? req.query.sort : `ht.created_at`;
    const order: string = req.query.order ? req.query.order : `desc`;
    const from_date: string = req.query.from_date;
    const to_date: string = req.query.to_date;
    const status: string = req.query.status;

    let whereClause: string = ` Where ht.customer_id = '${customer_id}'
    AND ht.is_deleted = FALSE
    AND cj.is_deleted = FALSE
    AND field.is_deleted = FALSE
    AND cd.is_deleted = FALSE
    AND cc.is_deleted = FALSE`;



    let subQueryWhereClause: string = ` WHERE
    cj.is_deleted = FALSE 
    AND cj.crop_acres IS NOT NULL 
    AND cj.crop_acres <> '' `;

    if(customer_id) subQueryWhereClause = `${subQueryWhereClause} AND cj.customer_id = '${customer_id}'`;
    if(farms) subQueryWhereClause = `${subQueryWhereClause} AND cj.farm_id = '${farms}'`;
    if(fields) subQueryWhereClause = `${subQueryWhereClause} AND cj.field_id = '${fields}'`;
    if(crops) subQueryWhereClause = `${subQueryWhereClause} AND cj.crop_id = '${crops}'`;
    if (from_date && to_date) subQueryWhereClause = ` ${subQueryWhereClause} AND cj.created_at > '${from_date}' AND cj.created_at < '${to_date}'`;

// Total Bushel Weight where clause
let totalBushelWeightWhereClause: string = ` WHERE
cc.is_deleted = FALSE 
AND cc.bushel_weight IS NOT NULL`;
if(customer_id) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND ht.customer_id = '${customer_id}'`;
if(farms) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND ht.farm_id = '${farms}'`;
if(fields) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND ht.field_id = '${fields}'`;
if(crops) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND ht.crop_id = '${crops}'`;
if (from_date && to_date) totalBushelWeightWhereClause = ` ${totalBushelWeightWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;


//Farmers Tickets Where clause
let farmersTicketsWhereClause: string = ` WHERE ht.farmers_bin_weight IS NOT NULL AND ht.farmers_bin_weight <> ''`;
if(customer_id) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.customer_id = '${customer_id}'`;
if(farms) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.farm_id = '${farms}'`;
if(fields) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.field_id = '${fields}'`;
if(crops) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.crop_id = '${crops}'`;
if (from_date && to_date) farmersTicketsWhereClause = ` ${farmersTicketsWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;


// Total Loads tickets
//Farmers Tickets Where clause
let TotalLoadsTicketsWhereClause: string = ` WHERE ht.customer_id = '${customer_id}'`;
if(farms) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.farm_id = '${farms}'`;
if(fields) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.field_id = '${fields}'`;
if(crops) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.crop_id = '${crops}'`;
if (from_date && to_date) TotalLoadsTicketsWhereClause = ` ${TotalLoadsTicketsWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;


    if (farms) whereClause = ` ${whereClause} AND cf."id" = '${farms}'`;
    if (crops) whereClause = ` ${whereClause} AND cc.id = '${crops}'`;
    if (created_at) whereClause = ` ${whereClause} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations_id) whereClause = ` ${whereClause} AND cd."id" = '${destinations_id}'`;
    if (fields) whereClause = ` ${whereClause} AND "field".ID = '${fields}'`;
    if (from_date && to_date) whereClause = ` ${whereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) whereClause = ` ${whereClause} AND ht.ticket_status = '${status}'`;


    let info_query = `
          
  SELECT DISTINCT
	cj.id,
	cj.job_setup_name,
	cf."name" AS farm_name,
	cc."name" AS crop_name,
  ht.delivery_ticket_name as ticket_name,
  ht.scale_ticket_number as sl_number,
  cd."name" AS destination,
  ht.loaded_miles AS load_miles,
  ht.ticket_status AS status,
  "field".NAME AS "field_name",
  ht.scale_ticket_weight AS net_pounds,
  cc.bushel_weight AS net_bushel,
  ht.created_at AS load_date,
  cj.farm_id as farm_id,
  cd."id" as destination_id,
  cj.crop_acres as acres,
  cj.crop_gps_acres as gps_acres,
  cj.crop_id as crop_id,
  "field".ID as field_id,
	ht.protein_content as protein,
	ht.moisture_content as moisture,
	ht.test_weight


FROM "Customer_Job_Setup" cj
LEFT JOIN "Crops" cc ON cc."id" = uuid(cj.crop_id)
LEFT JOIN "Customer_Farm" cf ON cf."id" = cj.farm_id
LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"
LEFT JOIN "Customer_Field" field ON "field".ID = ht.field_id
LEFT JOIN "Customer_Destination" cd ON cd.id = ht.destination_id



    ${whereClause}
    ORDER BY 
              ${sort} ${order}
    ;
    `;

    let details_query = `
    SELECT 
SUM(CAST(ht.scale_ticket_weight AS NUMERIC)) AS total_net_pounds,
SUM(CAST(ht.loaded_miles AS NUMERIC)) AS total_loaded_miles,

(
	SELECT SUM
		( bushel_weight ) 
	FROM
		(
		SELECT SUM( cc.bushel_weight ) AS bushel_weight 
		FROM
			"Crops" cc
			LEFT JOIN "Harvesting_Delivery_Ticket" ht ON uuid(ht.crop_id) = cc."id" 
		${totalBushelWeightWhereClause}
		) sub 
	) AS total_net_bushels,

  (SELECT SUM(crop_acres) 
   FROM (
       SELECT DISTINCT ON (cj."id") CAST(cj.crop_acres AS NUMERIC) as crop_acres
       FROM "Customer_Job_Setup" cj 
      ${subQueryWhereClause}

) sub
  ) AS total_acres,
  (
    SELECT count(id) AS farmers_tickets
    from "Harvesting_Delivery_Ticket" ht
    ${farmersTicketsWhereClause}
    ),
    (
    SELECT count(id) AS total_tickets
    from "Harvesting_Delivery_Ticket" ht
    ${TotalLoadsTicketsWhereClause}

    ),


customers.customer_name
FROM
"Customer_Job_Setup" cj
LEFT JOIN "Crops" cc ON cc."id" = uuid(cj.crop_id)
LEFT JOIN "Customer_Farm" cf ON cf."id" = cj.farm_id
LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"
LEFT JOIN "Customer_Field" field ON "field".ID = ht.field_id
LEFT JOIN "Customer_Destination" cd ON cd."name" = ht.destination
INNER JOIN "Customers" customers ON customers."id" = ht.customer_id

  ${whereClause}

AND scale_ticket_weight <> '' -- Exclude empty values
AND scale_ticket_weight IS NOT NULL -- Exclude NULL values
AND cj.crop_acres IS NOT NULL -- Exclude NULL values
AND cc.bushel_weight IS NOT NULL -- Exclude NULL values
AND ht.loaded_miles <> '' -- Exclude empty values
AND ht.loaded_miles IS NOT NULL -- Exclude NULL values
GROUP BY customers.customer_name ;
  `;


    let query = `${info_query} ${details_query}`;


    db.connect();
    // const filePath = 'query_test.txt';
    // try {
    //     await fs.promises.writeFile(filePath, query);
    //     context.log(`Data written to file`);
    // }
    // catch (err) {
    //     context.log.error(`Error writing data to file: ${err}`);
    // }


    let result = await db.query(query);



    let resp = {
      harvestingJobs: result[0].rows,
      details: result[1].rows,
    }

    
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
