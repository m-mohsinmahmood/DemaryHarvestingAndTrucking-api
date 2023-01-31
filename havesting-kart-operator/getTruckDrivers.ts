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
    
    let whereClause: string = ` WHERE "role" LIKE '%Truck Driver%' AND "dht_supervisor_id" IS NULL AND "is_deleted" = false`;

    if (search) whereClause = ` ${whereClause} AND LOWER("first_name") LIKE LOWER('%${search}%')`;

    let truck_drivers_dropdown_query = `
        SELECT 
              "id", 
              "first_name" || ' ' || "last_name" AS "name"
        FROM 
              "Employees" 
        ${whereClause};
      `;

    let query = `${truck_drivers_dropdown_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = result.rows;

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
