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
    const fields: string = req.query.fields_id;
    const destinations_id: string = req.query.destinations_id;
    const created_at: string = req.query.created_at;
    const sort: string = req.query.sort ? req.query.sort : `ht.created_at` ;
    const order: string = req.query.order ? req.query.order : `desc`;
    const from_date: string = req.query.from_date;
    const to_date: string = req.query.to_date;

    let whereClause: string = ` Where ht.customer_id = '${customer_id}'`;



    if (farms) whereClause = ` ${whereClause} AND cf."id" = '${farms}'`;
    if (crops) whereClause = ` ${whereClause} AND cc.id = '${crops}'`;
    if (created_at) whereClause = ` ${whereClause} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations_id) whereClause = ` ${whereClause} AND cd."id" = '${destinations_id}'`; 
    if (fields) whereClause = ` ${whereClause} AND "field".ID = '${fields}'`; 
    if (from_date && to_date) whereClause = ` ${whereClause} AND ht.created_at > '${from_date}' AND ht.created_at < '${to_date}'`; 


    let info_query = `
          
    SELECT
	ht.ID AS ID,
	ht.destination AS destination,
	ht.loaded_miles AS load_miles,
	ht.ticket_status AS status,
	"field".NAME AS "field_name",
	ht.scale_ticket_weight AS net_pounds,
	cc.bushel_weight AS net_bushel,
	ht.created_at AS load_date,
	cf."id" as farm_id,
  cd."id" as destination_id

FROM
	"Harvesting_Delivery_Ticket" ht
	INNER JOIN "Customer_Field" field ON "field".ID = ht.field_id
  INNER JOIN "Crops" cc ON cc."id" = uuid(ht.crop_id)
	INNER JOIN "Customer_Farm" cf ON cf."id" = ht.farm_id
	INNER JOIN "Customer_Destination" cd ON cd."name" = ht.destination



    ${whereClause}
    ORDER BY 
              ${sort} ${order}
    ;
    `;

    let details_query = `
    SELECT
  SUM(CAST(scale_ticket_weight AS NUMERIC)) AS total_net_pounds,
  SUM(CAST(cc.bushel_weight AS NUMERIC)) AS total_net_bushels,
  SUM(CAST(ht.loaded_miles AS NUMERIC)) AS total_loaded_miles,
  SUM(CAST(field.acres AS NUMERIC)) AS total_acres,
  COUNT(ht."id") AS total_tickets
FROM
  "Harvesting_Delivery_Ticket" ht
  INNER JOIN "Customer_Field" field ON field.ID = ht.field_id
  INNER JOIN "Crops" cc ON cc."id" = uuid(ht.crop_id)
  INNER JOIN "Customers" customers ON customers."id" = ht.customer_id
  INNER JOIN "Customer_Farm" cf ON cf."id" = ht.farm_id
  INNER JOIN "Customer_Destination" cd ON cd."name" = ht.destination


  ${whereClause}
  AND scale_ticket_weight <> '' -- Exclude empty values
  AND scale_ticket_weight IS NOT NULL -- Exclude NULL values

  GROUP BY customers.company_name ;
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
