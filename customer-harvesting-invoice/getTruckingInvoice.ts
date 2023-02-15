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

    let trucking_invoice_query = `
          
    select
tdt.id,
tdt.billing_id,
dwr.created_at,
customers.customer_name,
customers.address,
tr.rate,
tr.rate_type,
tdt.destination_city,
tdt.cargo,
tdt.quantity,
tdt.destination_state,
customers.address

from "Trucking_Rates" tr

INNER JOIN "Trucking_Delivery_Ticket" tdt ON tdt.customer_id = tr.customer_id AND tdt.rate_type = tr."id"
INNER JOIN "DWR" dwr ON dwr.delivery_ticket_id = tdt."id"
INNER JOIN "Customers" customers ON customers."id" = tdt.customer_id
WHERE customers.id = '${customer_id}' ;
      `;

    

    let query = `${trucking_invoice_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      truckingInvoices: result.rows
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
