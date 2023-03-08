import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { trucking } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const trucking: trucking = req.body;
    let query = `
        UPDATE  "Trucking_Invoice"
        SET     "customer_id"    = '${trucking.customer_id}', 
                "created_at" = '${trucking.date}',
                "billing_id"           =  '${trucking.billing_id}',
                "cargo"           =  '${trucking.cargo}',
                "city"    = '${trucking.city}', 
                "state" = '${trucking.state}',
                "rate_type"           =  '${trucking.rate_type}',
                "rate"    = '${trucking.rate}',
                "amount"    = '${trucking.amount}'

        WHERE   "id"             = '${trucking.id}';`

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
