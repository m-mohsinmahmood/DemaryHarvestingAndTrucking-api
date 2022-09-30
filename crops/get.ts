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
    let whereClause: string = ``;

    if (search) whereClause = `WHERE LOWER(c.name) LIKE LOWER('%${search}%')`;

    let crops_info_query = `
        SELECT c."id", c."name", c."category",c."bushel_weight"
        FROM "Crops" c
        ${whereClause};
      `;

    let crops_count_query = `
        SELECT COUNT(c."id")
        FROM "Crops" c
        ${whereClause};
      `;

    let query = `${crops_info_query} ${crops_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      crops: result[0].rows,
      count: +result[1].rows[0].count,
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
