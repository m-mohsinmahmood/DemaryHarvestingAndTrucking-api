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
    const rate_type: string = req.query.rateType || '';
    const sort: string = req.query.sort ? req.query.sort : `"created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE hr."customer_id" = '${customer_id}' AND hr."is_deleted" = false`;

    if (rate_type) {
      whereClause += ` AND "rate_type" = '${rate_type}'`;
    }

    let hauling_rates_query = `
    SELECT 
          hr."id",
          cf."id" AS "farm_id",
          cf."name" AS "farm_name",
          c."id" AS "crop_id",
          c."name" AS "crop_name",
          "rate_type", 
          "rate",
          "base_rate", 
          "premium_rate", 
          "base_bushels", 
          hr."customer_id", 
          hr."created_at",
          hr."hauling_fuel_cost",
          hr."truck_fuel_cost"

    FROM
          "Hauling_Rates" AS hr
            INNER JOIN "Customer_Farm" AS cf 
              ON cf.id = hr."farm_id" AND hr."is_deleted" = FALSE AND cf."is_deleted" = FALSE
            INNER JOIN "Crops" AS c 
              ON c.id = hr."crop_id" AND c.is_deleted = FALSE AND cf.is_deleted = FALSE
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
      `;

    let query = `${hauling_rates_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      hauling_rates: result.rows
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
