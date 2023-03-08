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
    const sort: string = req.query.sort ? req.query.sort : `ti."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;



    let trucking_list_query = `
    SELECT 
ti."id",
	ti.created_at as date,
	ti.billing_id,
	ti.cargo,
	ti.city,
	ti.state,
	ti.rate_type,
	ti.rate,
	ti.amount
	
	from "Trucking_Invoice" ti
  WHERE ti.customer_id = '${customer_id}'
        ORDER BY 
              ${sort} ${order};

      `;




    let query = `${trucking_list_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      truckingInvoicesList: result.rows
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
