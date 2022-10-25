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
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `"created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE "customer_id" = '${customer_id}'`;

    let trucking_rates_query = `
        SELECT 
                "id",
                "customer_id",
                "rate_type", 
                "rate",
                "created_at"
        FROM
                "Trucking_Rates"
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${(page - 1) * limit}
        LIMIT 
              ${limit};
      `;

    let trucking_rates_count_query = `
        SELECT 
                COUNT("id")
        FROM   
                "Trucking_Rates"
        ${whereClause};
      `;

    let query = `${trucking_rates_query} ${trucking_rates_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      trucking_rates: result[0].rows,
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
