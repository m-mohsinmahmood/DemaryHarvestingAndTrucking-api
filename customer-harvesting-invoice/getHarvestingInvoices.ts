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

    let harvesting_invoice_query = `
    select
hdt.id,
cf."name" as farm_name,
hdt.crop as crop_name,
hdt.loaded_miles,
hdt.quantity,
hdt.total_tons,
hdt.dht_tickets,
customers.customer_name,
hr.rate,
hr.rate_type as quantity_type,
hr.premium_rate,
hr.base_rate,
customers.address

from "Hauling_Rates" hr

INNER JOIN "Harvesting_Delivery_Ticket" hdt ON hdt.customer_id = hr.customer_id 
AND  hdt.quantity_type = hr.rate_type

INNER JOIN "Customer_Farm" cf on cf.id = hdt.farm_id

INNER JOIN "Customers" customers ON customers."id" = hdt.customer_id
WHERE customers.id = '${customer_id}' ;
      `;

      
    

    let query = `${harvesting_invoice_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      harvestingInvoices: result.rows
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
