import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_id: string = req.query.customer_id;
    const rate_type: string = req.query.rateType || '';
    const crop_id: string = req.query.cropId || '';
    const sort: string = req.query.sort ? req.query.sort : `"created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let hauling_rate_where_clause: string = `WHERE "customer_id" = '${customer_id}' AND "is_deleted" = false`;
    let combining_rate_where_clause: string = `WHERE "customer_id" = '${customer_id}'`;
    
    if (rate_type) {
      hauling_rate_where_clause += ` AND "rate_type" = '${rate_type}'`;
    }

    if (crop_id) {
      combining_rate_where_clause += ` AND "crop_id" = '${crop_id}'`;
    }


    let hauling_rates_query = `
        SELECT 
                "id",
                "rate_type", 
                "rate",
                "base_rate", 
                "premium_rate", 
                "base_bushels", 
                "customer_id", 
                "created_at"
        FROM
                "Hauling_Rates"
        ${hauling_rate_where_clause}
        ORDER BY 
              ${sort} ${order}
      `;

    let combining_rates_query = `
        SELECT 
                cr."id", 
                c."id" as "crop_id",
                CONCAT (c."name", ' (', c."variety", ')') AS "crop_name",
                c."bushel_weight", 
                cr."customer_id", 
                cr."combining_rate", 
                cr."base_bushels", 
                cr."premium_rate"
        FROM 
                "Combining_Rates" cr 
                INNER JOIN "Crops" c 
                ON cr."crop_id" = c."id" AND cr."is_deleted" = false
      ${combining_rate_where_clause}
    `;

    let query = `${hauling_rates_query}; ${combining_rates_query};`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      hauling_rates: result[0].rows,
      combining_rates: result[1].rows
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
