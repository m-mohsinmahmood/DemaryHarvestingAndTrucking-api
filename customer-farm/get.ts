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
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `created_at` ;
    const order: string = req.query.order ? req.query.order : `desc`;
    const customer_id: string = req.query.customerId;
    const status: string = req.query.status;
    let whereClause: string = ` WHERE "customer_id" = '${customer_id}' AND "is_deleted" = false`;

    if (search) whereClause = ` ${whereClause} AND LOWER(name) LIKE LOWER('%${search}%')`;
    if (status) whereClause  = ` ${whereClause} AND "status" = ${(status === 'true')}`;

    let customer_farm_query = `
        SELECT 
              "id",
              "name",
              "status"
        FROM 
              "Customer_Farm" 
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

    let customer_farm_count_query = `
        SELECT COUNT("id")
        FROM "Customer_Farm"
        ${whereClause};
      `;

    let query = `${customer_farm_query} ${customer_farm_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      customer_farms: result[0].rows,
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
