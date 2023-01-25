import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  console.log(req.query);

  try {
    const customer_id: string = req.query.customer_id;

    let dwr_info_query = `
          
    SELECT 
    ht.id as id, 
    ht.destination as destination, 
	  ht.loaded_miles as load_miles,
	  ht.status as status,
	  "field".name AS "field_name"

    FROM 
 
    "Harvesting_Ticket" ht 
	  INNER JOIN "Customer_Field" field ON "field".id = ht.field_id 


    Where 

    ht.status = 'verified' 
    And ht.customer_id = '${customer_id}'



      `;



    let query = `${dwr_info_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      harvestingJobs: result.rows
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
