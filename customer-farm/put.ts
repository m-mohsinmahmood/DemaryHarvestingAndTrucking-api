import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { farm } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const farm: farm = req.body;
    let query = `
        UPDATE "Customer_Farm" 
        SET "customer_id" = '${farm.customer_id}', 
            "name"        = '${farm.name}', 
            "status"      = '${farm.status}',
            "modified_at" = 'now()'
        WHERE 
            "id" = '${farm.id}';
        `;

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Farm has been updated successfully.",
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
