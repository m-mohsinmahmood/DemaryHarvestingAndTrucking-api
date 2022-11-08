import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_id: string = req.query.customerId;
    const sort: string = req.query.sort ? req.query.sort : `cr."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE cr."customer_id" = '${customer_id}'`;

    let combining_rates_query = `
        SELECT 
                cr."id", 
                c."id" as "crop_id",
                c."name" as "crop_name",
                c."bushel_weight", 
                cr."customer_id", 
                cr."combining_rate", 
                cr."base_bushels", 
                cr."premium_rate"
        FROM 
                "Combining_Rates" cr 
                INNER JOIN "Crops" c 
                ON cr."crop_id" = c."id" AND cr."is_deleted" = false

        ${whereClause}
        ORDER BY 
              ${sort} ${order}
      `;

    let query = `${combining_rates_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      combining_rates: result.rows
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
