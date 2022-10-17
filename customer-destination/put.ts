import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { destination } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const destination: destination = req.body;
    let query = `
        UPDATE  "Customer_Destination"
        SET     "customer_id"   = '${destination.customer_id}', 
                "farm_id"       = '${destination.farm_id}', 
                "name"          = '${destination.name}',
                "calendar_year" = '${destination.calendar_year}',
                "status"        = '${destination.status}',
        WHERE   "id"            = '${destination.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer destination has been updated successfully.",
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
