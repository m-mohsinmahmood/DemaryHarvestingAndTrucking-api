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

    let farming_invoice_query = `
          
    SELECT 
fwo.id,
fr.rate,
fr.equipment_type,

dwr.created_at,
dwr.start_time,
dwr.end_time,
(dwr.end_time - dwr.start_time) as hours,
customers.customer_name,
customers.address

from "Farming_Rates" fr
	INNER JOIN "Farming_Work_Order" fwo ON fwo.customer_id = fr.customer_id
		AND fwo.equipment_type = fr.equipment_type

	INNER JOIN "DWR" dwr ON dwr.work_order_id = fwo.id
	INNER JOIN "Customers" customers ON customers."id" = fwo.customer_id
WHERE customers.id = '${customer_id}' ;
      `;

    

    let query = `${farming_invoice_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      farmingInvoices: result.rows
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
