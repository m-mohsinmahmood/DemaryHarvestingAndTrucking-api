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
    const sort: string = req.query.sort ? req.query.sort : `"created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE "customer_id" = '${customer_id}' AND "is_deleted" = false`;

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
