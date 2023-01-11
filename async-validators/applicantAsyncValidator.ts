import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const email: string = req.query.email;

    let query = `
        SELECT *
        FROM "Applicants"
        WHERE "email" = '${email}'
      `;

    db.connect();

    let result = await db.query(query);
    let resp;
    result.rows.length > 0 ? resp = true : resp = false; 
    db.end();

    context.res = {
      status: 200,
      body: { 'emailAlreadyExists': resp },
    };

    context.done();
    return;

  } catch (error) {
    db.end();
    context.res = {
      status: 500,
      body: error,
    };
    context.done();
    return;
  }
};
export default httpTrigger;