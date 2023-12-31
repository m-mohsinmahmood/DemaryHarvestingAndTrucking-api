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
    const status: string = req.query.status;
    // const customer_type: string = req.query.type;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `created_at` ;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = ` WHERE "is_deleted" = FALSE`;

    if (search) whereClause = ` ${whereClause} AND LOWER(name) LIKE LOWER('%${search}%')`;
    // if (status) whereClause = ` ${whereClause} AND "status" = ${(status === 'true')}`;

    let machinery_info_query = `
        SELECT 
              "id", 
              "name",
              "pictures", 
              "type", 
              "model", 
              "make", 
              "year", 
              "serial_number", 
              "status"
        FROM 
              "Machinery"
              ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

    let machinery_count_query = `
        SELECT 
              COUNT("id")
        FROM 
              "Machinery"
        ${whereClause};
      `;

    let query = `${machinery_info_query} ${machinery_count_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      machinery: result[0].rows,
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
