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

    let whereClause: string = ` WHERE "is_deleted" = FALSE AND "status" = TRUE AND trucking_company IS NOT NULL`;

    if (search) whereClause = ` ${whereClause} AND LOWER(trucking_company) LIKE LOWER('%${search}%')`;

    let truckingCompanyQuery = `
    Select DISTINCT(trucking_company) from "Harvesting_Delivery_Ticket" ${whereClause} ORDER BY "trucking_company" ASC;`;

    let truckingCompanyCount = `
    SELECT Count(DISTINCT(trucking_company)) from "Harvesting_Delivery_Ticket" ${whereClause}
    `;
    let query = `${truckingCompanyQuery} ${truckingCompanyCount}`;

    await db.connect();

    let result = await db.query(query);

    let resp = {
      trucking_company: result[0].rows,
      count: +result[1].rows[0].count,
    };

    context.res = {
      status: 200,
      body: resp,
    };

  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    ;
  }

  finally {
    db.end();
    context.done();

  }
};

export default httpTrigger;
