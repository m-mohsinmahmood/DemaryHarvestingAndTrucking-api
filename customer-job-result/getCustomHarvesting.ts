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
    const destinations: string = req.query.destinations;
    const date: string = req.query.date;
    const created_at: string = req.query.created_at;

    let whereClause: string = ` Where ht.customer_id = '${customer_id}'`;



    if (farms) whereClause = ` ${whereClause} AND cf."id" = '${farms}'`;
    if (crops) whereClause = ` ${whereClause} AND cc.id = '${crops}'`;
    if (created_at) whereClause = ` ${whereClause} AND  extract(year from "created_at") = '${created_at}'`;
    if (destinations) whereClause = ` ${whereClause} AND ht.destinations = '${destinations}'`; 


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
	cf."id" as farm_id
FROM
	"Harvesting_Delivery_Ticket" ht
	INNER JOIN "Customer_Field" field ON "field".ID = ht.field_id
	INNER JOIN "Crops" cc ON cc."name" = ht.crop 
	INNER JOIN "Customer_Farm" cf ON cf."id" = ht.farm_id



    ${whereClause}
    ;
    `;

    let details_query = `
    SELECT SUM
	( CAST ( scale_ticket_weight AS FLOAT ) ) AS total_net_pounds,
	SUM ( CAST ( cc.bushel_weight AS FLOAT ) ) AS total_net_bushels,
	SUM ( CAST ( ht.loaded_miles AS FLOAT ) ) AS total_loaded_miles,
	SUM ( CAST ( field.acres AS FLOAT ) ) AS total_acres,
  SUM ( CAST ( ht.loaded_miles AS FLOAT ) ) AS total_loaded_miles,
	Count ( ht."id" ) AS total_tickets
    
    
  FROM
  
    "Harvesting_Delivery_Ticket" ht
    INNER JOIN "Customer_Field" field ON "field".ID = ht.field_id
    INNER JOIN "Crops" cc ON cc."name" = ht.crop
    INNER JOIN "Customers" customers ON customers."id" = ht.customer_id
    INNER JOIN "Customer_Farm" cf ON cf."id" = ht.farm_id


  ${whereClause} 
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
