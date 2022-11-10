import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { multipleFields } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const field: multipleFields = req.body;

    let query = `
        UPDATE  "Customer_Field"
        SET     "customer_id"   = '${field.customer_id}', 
                "farm_id"       = '${field.farm_id}', 
                "name"          = '${field.fields[0].name}',
                "acres"         = '${field.fields[0].acres}', 
                "calendar_year" = '${field.fields[0].calendar_year}',
                "status"        = ${field.fields[0].status}
        WHERE   "id"            = '${field.id}';`

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
