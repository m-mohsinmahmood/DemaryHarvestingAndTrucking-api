import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { farming_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const farming_rate: farming_rate = req.body;
    let query = `
        UPDATE  "Farming_Rates"
        SET     "customer_id"    = '${farming_rate.customer_id}', 
                "equipment_type" = '${farming_rate.equipment_type}',
                "rate"           =  ${farming_rate.rate ? farming_rate.rate : 0 }
        WHERE   "id"             = '${farming_rate.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Farming Rate has been updated successfully.",
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
