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
    const farm_id: string = req.query.farmId;
    const status: string = req.query.status;
    const year: string = req.query.year;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `fi."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE f."customer_id" = '${customer_id}'`;

    if (search)  whereClause  = ` ${whereClause} AND LOWER(fi."name") LIKE LOWER('%${search}%')`;
    if (farm_id) whereClause  = ` ${whereClause} AND fi."farm_id" = '${farm_id}'`;
    if (status)  whereClause  = ` ${whereClause} AND fi."status" = ${(status === 'true')}`;
    if (year) whereClause  = ` ${whereClause} AND EXTRACT(YEAR FROM fi."calendar_year") = '${year}'`;

    let customer_field_query = `
        SELECT 
                f."id" AS "farm_id", 
                f."name" AS "farm_name", 
                fi."id" AS "field_id", 
                fi."name" AS "field_name", 
                fi."acres", 
                fi."calendar_year",
                fi."status"
        FROM 
                "Customer_Farm" f
                INNER JOIN "Customer_Field" fi 
                ON f."id" = fi."farm_id" AND f."customer_id" = '${customer_id}' AND fi."is_deleted" = false AND f."is_deleted" = FALSE

        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${(page - 1) * limit}
        LIMIT 
              ${limit};
      `;

    let customer_field_count_query = `
        SELECT 
                COUNT(f."id")
        FROM   
                "Customer_Farm" f
                INNER JOIN "Customer_Field" fi 
                ON f."id" = fi."farm_id" AND f."customer_id" = '${customer_id}' AND fi."is_deleted" = false AND f."is_deleted" = FALSE
        ${whereClause};
      `;

    let query = `${customer_field_query} ${customer_field_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      customer_fields: result[0].rows,
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
