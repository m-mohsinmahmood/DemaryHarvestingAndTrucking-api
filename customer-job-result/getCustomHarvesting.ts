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
    const sort: string = req.query.sort ? req.query.sort : `load_Date`;
    const order: string = req.query.order ? req.query.order : `desc`;
    const from_date: string = req.query.from_date;
    const to_date: string = req.query.to_date;
    const status: string = req.query.status;




    let subQueryWhereClause: string = ` WHERE
    cj.is_deleted = FALSE 
    AND ht.is_deleted != TRUE
    AND cj.crop_acres IS NOT NULL 
    AND cj.crop_acres <> '' `;

    if(customer_id) subQueryWhereClause = `${subQueryWhereClause} AND cj.customer_id = '${customer_id}'`;
    if(farms) subQueryWhereClause = `${subQueryWhereClause} AND cj.farm_id = '${farms}'`;
    if(fields) subQueryWhereClause = `${subQueryWhereClause} AND ht.field_id = '${fields}'`;
    if(crops) subQueryWhereClause = `${subQueryWhereClause} AND cj.crop_id = '${crops}'`;
    if (from_date && to_date) subQueryWhereClause = ` ${subQueryWhereClause} AND cj.created_at > '${from_date}' AND cj.created_at < '${to_date}'`;
    if (destinations_id) subQueryWhereClause = ` ${subQueryWhereClause} AND ht.destination_id = '${destinations_id}'`;

// Total Bushel Weight where clause
let totalBushelWeightWhereClause: string = ` WHERE
cj.is_deleted = FALSE
AND ht.is_deleted != TRUE
AND ht.scale_ticket_weight IS NOT NULL
AND ht.scale_ticket_weight <> ''`;

if(customer_id) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND cj.customer_id = '${customer_id}'`;
if(farms) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND cj.farm_id = '${farms}'`;
if(fields) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND ht.field_id = '${fields}'`;
if(crops) totalBushelWeightWhereClause = `${totalBushelWeightWhereClause} AND cj.crop_id = '${crops}'`;
if (from_date && to_date) totalBushelWeightWhereClause = ` ${totalBushelWeightWhereClause} AND cj.created_at > '${from_date}' AND cj.created_at < '${to_date}'`;
if (destinations_id) totalBushelWeightWhereClause = ` ${totalBushelWeightWhereClause} AND ht.destination_id = '${destinations_id}'`;


//Farmers Tickets Where clause
let farmersTicketsWhereClause: string = ` WHERE ht.farmers_bin_weight IS NOT NULL AND ht.farmers_bin_weight <> ''`;
if(customer_id) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.customer_id = '${customer_id}' AND ht.is_deleted != TRUE`;
if(farms) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.farm_id = '${farms}'`;
if(fields) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.field_id = '${fields}'`;
if(crops) farmersTicketsWhereClause = `${farmersTicketsWhereClause} AND ht.crop_id = '${crops}'`;
if (from_date && to_date) farmersTicketsWhereClause = ` ${farmersTicketsWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
if (destinations_id) farmersTicketsWhereClause = ` ${farmersTicketsWhereClause} AND ht.destination_id = '${destinations_id}'`;


// Total Loads tickets
let TotalLoadsTicketsWhereClause: string = ` WHERE ht.customer_id = '${customer_id}' AND ht.is_deleted != TRUE`;
if(farms) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.farm_id = '${farms}'`;
if(fields) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.field_id = '${fields}'`;
if(crops) TotalLoadsTicketsWhereClause = `${TotalLoadsTicketsWhereClause} AND ht.crop_id = '${crops}'`;
if (from_date && to_date) TotalLoadsTicketsWhereClause = ` ${TotalLoadsTicketsWhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
if (destinations_id) TotalLoadsTicketsWhereClause = ` ${TotalLoadsTicketsWhereClause} AND ht.destination_id = '${destinations_id}'`;

    let whereClause: string = ` Where ht.customer_id = '${customer_id}'
    AND ht.is_deleted != TRUE
    AND cj.is_deleted = FALSE
    AND field.is_deleted = FALSE
    AND cd.is_deleted = FALSE
    AND cc.is_deleted = FALSE`;


    if (farms) whereClause = ` ${whereClause} AND cf."id" = '${farms}'`;
    if (crops) whereClause = ` ${whereClause} AND cc.id = '${crops}'`;
    if (created_at) whereClause = ` ${whereClause} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations_id) whereClause = ` ${whereClause} AND cd."id" = '${destinations_id}'`;
    if (fields) whereClause = ` ${whereClause} AND "field".ID = '${fields}'`;
    if (from_date && to_date) whereClause = ` ${whereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) whereClause = ` ${whereClause} AND ht.ticket_status = '${status}'`;


    let whereClauseJobs: string = `WHERE cj.customer_id = '${customer_id}'  AND cj.is_deleted = FALSE AND ht.is_deleted != TRUE`;


    if (farms) whereClauseJobs = ` ${whereClauseJobs} AND cf."id" = '${farms}'`;
    if (crops) whereClauseJobs = ` ${whereClauseJobs} AND cj.crop_id = '${crops}'`;
    if (created_at) whereClauseJobs = ` ${whereClauseJobs} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations_id) whereClauseJobs = ` ${whereClauseJobs} AND cd."id" = '${destinations_id}'`;
    if (fields) whereClauseJobs = ` ${whereClauseJobs} AND "field".ID = '${fields}'`;
    if (from_date && to_date) whereClauseJobs = ` ${whereClauseJobs} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) whereClauseJobs = ` ${whereClauseJobs} AND ht.ticket_status = '${status}'`;

    //Loaded miles where clause
    let loadMileswhereClause: string = ` Where ht.customer_id = '${customer_id}' AND ht.is_deleted != TRUE
    AND ht.loaded_miles <> ''
    AND ht.loaded_miles IS NOT NULL`;
    if(farms) loadMileswhereClause = `${loadMileswhereClause} AND ht.farm_id = '${farms}'`;
    if(fields) loadMileswhereClause = `${loadMileswhereClause} AND ht.field_id = '${fields}'`;
    if(crops) loadMileswhereClause = `${loadMileswhereClause} AND ht.crop_id = '${crops}'`;
    if (from_date && to_date) loadMileswhereClause = ` ${loadMileswhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (destinations_id) loadMileswhereClause = ` ${loadMileswhereClause} AND ht.destination_id = '${destinations_id}'`;
    if (from_date && to_date) loadMileswhereClause = ` ${loadMileswhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;


    //net pounds 
    let netPoundswhereClause: string = ` Where ht.customer_id = '${customer_id}'`;


    if (farms) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.farm_id = '${farms}'`;
    if (fields) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.field_id = '${fields}'`;
    if(crops) netPoundswhereClause = `${netPoundswhereClause} AND ht.crop_id = '${crops}'`;
    if (from_date && to_date) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`;
    if (status) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.ticket_status = '${status}'`;
    if (destinations_id) netPoundswhereClause = ` ${netPoundswhereClause} AND ht.destination_id = '${destinations_id}'`;

    let info_query = `
          
    SELECT
    cj."id",
    cj.job_setup_name,
    cj.farm_id AS farm_id,
    cj.crop_acres AS acres,
    cj.crop_gps_acres AS gps_acres,
    cj.crop_id AS crop_id,
    ht.id as "delivery_ticket_id",
    ht.delivery_ticket_name::TEXT AS ticket_name,
    ht.scale_ticket_number AS sl_number,
    ht.loaded_miles AS load_miles,
    ht.ticket_status AS status,
    ht.scale_ticket_weight AS net_pounds,
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
    C.bushel_weight AS bushel_weight
        
        FROM
    "Customer_Job_Setup" cj
    LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id" AND ht.is_deleted != TRUE
    LEFT JOIN "Customer_Farm" cf ON cj.farm_id = cf.ID AND cf.is_deleted = FALSE AND cf.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Field" field ON ht.field_id = field."id" AND field.is_deleted = FALSE AND field.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Destination" cd ON ht.destination_id = cd.ID AND cd.is_deleted = FALSE AND cd.customer_id = '${customer_id}'
    LEFT JOIN "Crops" C ON cj.crop_id = C."id"
            ${whereClauseJobs}

        
UNION ALL

SELECT
    cj."id",
    cj.job_setup_name,
    cj.farm_id AS farm_id,
    cj.crop_acres AS acres,
    cj.crop_gps_acres AS gps_acres,
    cj.crop_id AS crop_id,
    ht.id as "delivery_ticket_id",
    concat(ht.delivery_ticket_name, '-SL')::TEXT AS ticket_name,
    ht.scale_ticket_number AS sl_number,
    ht.loaded_miles AS load_miles,
    ht.ticket_status AS status,
    ht.split_cart_scale_weight AS net_pounds,
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
    C.bushel_weight AS bushel_weight
        
        FROM
    "Customer_Job_Setup" cj
    LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id" AND ht.is_deleted != TRUE
    LEFT JOIN "Customer_Farm" cf ON cj.farm_id = cf.ID AND cf.is_deleted = FALSE AND cf.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Field" field ON CAST(ht.split_field_id AS UUID) = field."id" AND field.is_deleted = FALSE AND field.customer_id = '${customer_id}'
    LEFT JOIN "Customer_Destination" cd ON ht.destination_id = cd.ID AND cd.is_deleted = FALSE AND cd.customer_id = '${customer_id}'
    LEFT JOIN "Crops" C ON cj.crop_id = C."id"
            ${whereClauseJobs}

    AND ht.split_load_check = TRUE

    ORDER BY 
              ${sort} ${order}
    ;
    `;

    let details_query =   `
    SELECT DISTINCT
(
  SELECT 
SUM(CAST(ht.scale_ticket_weight AS NUMERIC)) AS total_net_pounds
FROM "Harvesting_Delivery_Ticket" ht
${netPoundswhereClause}
AND ht.is_deleted != TRUE
AND ht.scale_ticket_weight IS NOT NULL
AND ht.scale_ticket_weight <> '' 


) AS total_net_pounds,
(
  SELECT SUM(CAST (loaded_miles AS NUMERIC))
FROM "Harvesting_Delivery_Ticket" ht
${loadMileswhereClause}
) as total_loaded_miles,
( SELECT
  SUM(total_pounds / NULLIF(bushel_weight, 0)) AS total_bushels
FROM (
  SELECT
      cj.id AS job_id,
      SUM(CAST(ht.scale_ticket_weight AS NUMERIC)) AS total_pounds
  FROM
      "Harvesting_Delivery_Ticket" ht
  INNER JOIN
      "Customer_Job_Setup" cj ON ht.job_id = cj.id
  ${totalBushelWeightWhereClause}
  GROUP BY
      cj.id
) AS tp
CROSS JOIN (
  SELECT
      c.id,
      c.bushel_weight
  FROM
      "Crops" c
  INNER JOIN
      "Customer_Crop" cc ON c.id = cc.crop_id
  WHERE
      cc.is_deleted = FALSE
      AND c.is_deleted = FALSE
      AND cc.customer_id = '${customer_id}'
  GROUP BY
      c.id, c.bushel_weight
) AS dbw
) AS total_net_bushels,

  (SELECT SUM(crop_acres) 
   FROM (
       SELECT DISTINCT ON (cj."id") CAST(cj.crop_acres AS NUMERIC) as crop_acres
       FROM "Customer_Job_Setup" cj 
       LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"

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

    )
FROM
"Customer_Job_Setup" cj
LEFT JOIN "Crops" cc ON cc."id" = uuid(cj.crop_id)
LEFT JOIN "Customer_Farm" cf ON cf."id" = cj.farm_id
LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"
LEFT JOIN "Customer_Field" field ON "field".ID = ht.field_id
LEFT JOIN "Customer_Destination" cd ON cd."name" = ht.destination
INNER JOIN "Customers" customers ON customers."id" = ht.customer_id

  ${whereClause}

;
  `;
    let query = `${info_query} ${details_query}`;


    db.connect();

    let result = await db.query(query);

    let resp = {
      harvestingJobs: result[0].rows,
      details: result[1].rows
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
