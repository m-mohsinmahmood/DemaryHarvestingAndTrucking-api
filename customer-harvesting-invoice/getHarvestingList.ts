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
    const sort: string = req.query.sort ? req.query.sort : `hi."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;



    let harvesting_list_query = `
    SELECT 
	cf."name" as farm_name,
	hi.service_type,
	hi.crop_name,
	hi.quantity_type,
	hi.quantity,
	hi.rate,
	hi.amount,
  hi.id,
  cf.id as farm_id
	
	from "Harvesting_Invoice" hi
	
	INNER JOIN "Customer_Farm" cf ON cf."id" =  hi.farm_id
  WHERE hi.customer_id = '${customer_id}'
        ORDER BY 
              ${sort} ${order};

      `;




    let query = `${harvesting_list_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      harvestingInvoicesList: result.rows
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
