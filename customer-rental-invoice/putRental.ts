import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { rentals } from './model';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const rentals: rentals = req.body;
    let query = `
        UPDATE  "Rental_Invoice"
        SET     "customer_id"     = '${rentals.customer_id}', 
                "created_at"            = '${rentals.date}',
                "rental_type"  = '${rentals.rental_type}',
                "quantity_type"   =  '${rentals.quantity_type}',
                "quantity"        = '${rentals.quantity}', 
                "rate"            = '${rentals.rate}',
                "amount"          =  '${rentals.amount}'
              
        WHERE   "id"             = '${rentals.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Invoice has been updated successfully.",
      },
    };
    context.done();
    return;
  } catch (error) {
    db.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    return;
  }
};

export default httpTrigger;
