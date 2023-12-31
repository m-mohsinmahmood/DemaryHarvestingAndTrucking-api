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
    const status: string = req.query.status;
    const year: string = req.query.year;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `cc."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE cc."customer_id" = '${customer_id}'`;

    if (search) whereClause = whereClause + ` AND LOWER(c."name") LIKE LOWER('%${search}%')`;
    if (status) whereClause = ` ${whereClause} AND cc."status" = ${status === "true"}`;
    if (year) whereClause  = ` ${whereClause} AND EXTRACT(YEAR FROM cc."calendar_year") = '${year}'`;

    let customer_crop_query = `
        SELECT 
                c."id"   as "crop_id",
                CONCAT (c."name", ' (', c."variety", ')') as "crop_name",
                cc."id"  as "customer_crop_id", 
                cc."calendar_year",
                cc."status"
        FROM 
                "Crops" c
                INNER JOIN "Customer_Crop" cc 
                ON c."id" = cc."crop_id" AND cc."customer_id" = '${customer_id}' AND cc."is_deleted" = FALSE    

        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${(page - 1) * limit}
        LIMIT 
              ${limit};
      `;

    let customer_crop_count_query = `
        SELECT 
                COUNT(cc."id")
        FROM   
                "Crops" c
                INNER JOIN "Customer_Crop" cc 
                ON c."id" = cc."crop_id" AND cc."customer_id" = '${customer_id}' AND cc."is_deleted" = FALSE
        ${whereClause};
      `;

    let query = `${customer_crop_query} ${customer_crop_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      customer_crops: result[0].rows,
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
