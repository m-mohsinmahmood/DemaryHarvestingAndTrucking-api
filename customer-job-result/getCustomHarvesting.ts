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

    let info_query = `
          
    SELECT 
    ht.id as id, 
    ht.destination as destination, 
	  ht.loaded_miles as load_miles,
	  ht.status as status,
	  "field".name AS "field_name",
    ht.scale_ticket_weight as net_pounds,
		cc.bushel_weight as net_bushel
		
    FROM 
 
    "Harvesting_Ticket" ht 
	  INNER JOIN "Customer_Field" field ON "field".id = ht.field_id 
		INNER JOIN "Crops"  cc ON  cc."id" = ht.crop_id 



    Where 

    ht.status = 'verified' 
    And ht.customer_id = '${customer_id}';
    `;

    let count_query = `
    SELECT 
    SUM(loaded_miles)
    FROM "Harvesting_Ticket" 
    WHERE customer_id = '${customer_id}';
    `;


    let query = `${info_query} ${count_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      harvestingJobs: result[0].rows,
      total_loads: +result[1].rows[0].sum,
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
