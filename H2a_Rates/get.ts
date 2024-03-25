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
    const year: string = req.query.year;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 50;
    const sort: string = req.query.sort ? req.query.sort : `state`;
    const order: string = req.query.order ? req.query.order : `asc`;
    let whereClause: string = ` WHERE "is_deleted" = false`;

    if (search) whereClause = ` ${whereClause} AND LOWER(state) LIKE LOWER('%${search}%')`;
    if (year) whereClause = ` ${whereClause} AND EXTRACT(YEAR from year)= '${year}'`;

    let h2a_rates_info_query = `
        SELECT 
              "id", 
              "state", 
              "hourly_rate",
              "rate_type",
              "year"
        FROM 
              "H2a_Hourly_Rate" 
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

    let h2a_rates__count_query = `
    SELECT 
            COUNT("id")
            FROM 
            "H2a_Hourly_Rate"
        ${whereClause};
      `;

    let query = `${h2a_rates_info_query} ${h2a_rates__count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      h2a_rates: result[0].rows,
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
