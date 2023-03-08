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
      SELECT emp.email , app.email  
      FROM "Employees" emp

      FULL JOIN "Applicants" app ON 
      emp.email = app.email

      WHERE (app.email = '${email}' AND app.is_deleted = FALSE) OR (emp.email = '${email}'  AND emp.is_deleted = FALSE);
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