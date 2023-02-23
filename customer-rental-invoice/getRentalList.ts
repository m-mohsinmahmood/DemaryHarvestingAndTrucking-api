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
    const sort: string = req.query.sort ? req.query.sort : `ri."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;



    let rental_list_query = `
    SELECT 
    ri."id",
    ri.created_at as date,
    ri.rental_type,
    ri.quantity_type,
    ri.quantity,
    ri.rate,
    ri.amount,
    ri.customer_id
    
    from "Rental_Invoice" ri
  WHERE ri.customer_id = '${customer_id}'
       ;

      `;




    let query = `${rental_list_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      rentalInvoicesList: result.rows
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
