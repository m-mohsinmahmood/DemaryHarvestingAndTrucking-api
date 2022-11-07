import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_field_id: string = req.query.id;
    let query = `
        UPDATE "Customer_Field" 
        SET "is_deleted"  = TRUE, 
            "modified_at" = 'now()'
        WHERE 
            "id" = '${customer_field_id}';
        `;

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer field has been deleted successfully.",
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
