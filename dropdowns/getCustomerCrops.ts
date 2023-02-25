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
    let whereClause: string = `WHERE "is_deleted" = false`;

    if (search) whereClause = ` ${whereClause} AND LOWER(c."name") LIKE LOWER('%${search}%')`;

    let customer_crop_dropdown_query = `
        SELECT 
                c."id"                                AS "crop_id",
                CONCAT ("name", ' (', "variety", ')') AS "name",
                cc."id"                               AS "customer_crop_id"
        FROM 
                "Crops" c
                INNER JOIN "Customer_Crop" cc 
                ON c."id" = cc."crop_id" AND cc."customer_id" = '${customer_id}' AND cc."is_deleted" = FALSE AND cc."status" = TRUE
        ${whereClause}
        ORDER BY 
                c."name" ASC;
        `

    let customer_crop_count_query = `
        SELECT 
                COUNT(c."id")
                FROM 
                "Crops" c
                INNER JOIN "Customer_Crop" cc 
                ON c."id" = cc."crop_id" AND cc."customer_id" = '${customer_id}' AND cc."is_deleted" = FALSE AND cc."status" = TRUE
        ${whereClause};
      `;

    let query = `${customer_crop_dropdown_query} ${customer_crop_count_query}`;

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
