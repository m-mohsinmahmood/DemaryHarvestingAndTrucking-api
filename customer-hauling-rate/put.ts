import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { field } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const field: field = req.body;
    let query = `
        UPDATE  "Customer_Field"
        SET     "customer_id"  = '${field.customer_id}', 
                "crop_id"      = '${field.crop_id}', 
                "rate_type"    = '${field.rate_type}',
                "base_rate"    = '${field.base_rate}', 
                "premium_rate" = '${field.premium_rate}'
                
        WHERE   "id"           = '${field.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer field has been updated successfully.",
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
