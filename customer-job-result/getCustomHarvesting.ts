import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

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

    let whereClause: string = ` Where ht.customer_id = '${customer_id}'`;



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
  "field".ID as field_id


FROM "Customer_Job_Setup" cj
LEFT JOIN "Crops" cc ON cc."id" = uuid(cj.crop_id)
LEFT JOIN "Customer_Farm" cf ON cf."id" = cj.farm_id
LEFT JOIN "Harvesting_Delivery_Ticket" ht ON ht.job_id = cj."id"
LEFT JOIN "Customer_Field" field ON "field".ID = ht.field_id
LEFT JOIN "Customer_Destination" cd ON cd."name" = ht.destination



    ${whereClause}
    ORDER BY 
              ${sort} ${order}
    ;
    `;

    let details_query = `
    SELECT
  SUM(CAST(ht.scale_ticket_weight AS NUMERIC)) AS total_net_pounds,
  SUM(CAST(cc.bushel_weight AS NUMERIC)) AS total_net_bushels,
  SUM(CAST(ht.loaded_miles AS NUMERIC)) AS total_loaded_miles,
  SUM(CAST(field.acres AS NUMERIC)) AS total_acres,
  SUM(CAST(cj.crop_acres AS FLOAT)) AS crop_acres,
  COUNT(ht."id") AS total_tickets,
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
  AND cj.crop_acres <> '' -- Exclude empty values
  AND cj.crop_acres IS NOT NULL -- Exclude NULL values

  GROUP BY customers.customer_name ;
  `;


    let query = `${info_query} ${details_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);
    console.log(result[0].rows);



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
