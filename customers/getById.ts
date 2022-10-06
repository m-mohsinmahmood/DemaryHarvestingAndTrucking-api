import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {

    const customer_id: string = req.query.id;

    let customer_info_query = `
        SELECT c."company_name", c."first_name", c."last_name", c."state", c."country", c."phone_number", c."email", c."customer_type", c."status"
        FROM "Customers" c
        WHERE c."id" = '${customer_id}';
      `;

    db.connect();

    let result = await db.query(customer_info_query);
    let resp;
    if(result.rows.length > 0)
      resp = result.rows[0];
    else 
      resp = {
        message: "No customer exists with this id."
      };

    db.end();

    context.res = {
      status: 200,
      body: resp,
    };

    context.done();
    return;
  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    context.done();
    return;
  }
};

export default httpTrigger;
