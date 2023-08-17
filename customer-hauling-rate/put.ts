import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { hauling_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const hauling_rate: hauling_rate = req.body;
    let query = `
        UPDATE  "Hauling_Rates"
        SET     "customer_id"  = '${hauling_rate.customer_id}', 
                "rate_type"    = '${hauling_rate.rate_type}',
                "rate"         =  ${hauling_rate.rate ? hauling_rate.rate : 0 },
                "base_rate"    =  ${hauling_rate.base_rate ? hauling_rate.base_rate : 0}, 
                "premium_rate" =  ${hauling_rate.premium_rate ? hauling_rate.premium_rate : 0},
                "base_bushels" =  ${hauling_rate.base_bushels ? hauling_rate.base_bushels : 0}
                
        WHERE   "id"           = '${hauling_rate.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Hauling Rate has been updated successfully.",
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
