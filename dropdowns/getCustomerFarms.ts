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
    const customer_id: string = req.query.customerId;

    let whereClause: string = ` WHERE "is_deleted" = FALSE AND "status" = TRUE AND "customer_id" = '${customer_id}'`;

    if (search) whereClause = ` ${whereClause} AND LOWER(name) LIKE LOWER('%${search}%')`;

    let customer_farm_query = `
        SELECT 
              "id",
              "name"
        FROM 
              "Customer_Farm" 
        ${whereClause}
        ORDER BY 
              "name" ASC;
      `;

    let customer_farm_count_query = `
      SELECT 
              COUNT("id")
              FROM 
              "Customer_Farm" 
        ${whereClause}
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
