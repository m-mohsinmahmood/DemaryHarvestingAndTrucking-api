import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { harvesting } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const harvesting: harvesting = req.body;
    let query = `
        UPDATE  "Harvesting_Invoice"
        SET     "customer_id"    = '${harvesting.customer_id}', 
                "service_type" = '${harvesting.service_type}',
                "quantity"           =  '${harvesting.qty}',
                "quantity_type"           =  '${harvesting.qty_type}',
                "rate"    = '${harvesting.rate}', 
                "amount" = '${harvesting.amount}',
                "farm_id"           =  '${harvesting.farm_id}',
                "crop"    = '${harvesting.crop}'
        WHERE   "id"             = '${harvesting.id}';`

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
