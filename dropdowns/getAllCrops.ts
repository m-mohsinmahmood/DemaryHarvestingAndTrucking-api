import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const search: string = req.query.search;
    let whereClause: string = `WHERE "is_deleted" = false`;

    if (search) whereClause = whereClause + ` AND LOWER(name) LIKE LOWER('%${search}%')`;

    let crops_dropdown_query = `
        SELECT 
              "id", 
              CONCAT ("name", ' (', "variety", ')') AS "name"
        FROM 
              "Crops" 
        ${whereClause}
        ORDER BY 
              "name" ASC
      `;

    let query = `${crops_dropdown_query}`;

    await db.connect();

    let result = await db.query(query);

    let resp = {
      crops: result.rows
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
