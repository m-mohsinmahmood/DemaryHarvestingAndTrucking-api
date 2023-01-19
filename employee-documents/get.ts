import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee_id: string = req.query.id;
    let employee_docs_query = `
        SELECT 
                *
        FROM 
                "Employee_Documents"
        WHERE   
                "employee_id" = '${employee_id}'
       
      `;

    let query = `${employee_docs_query}`;

    db.connect();

    let result = await db.query(query);
    let resp = {
      employee_docs: result.rows[0],
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
