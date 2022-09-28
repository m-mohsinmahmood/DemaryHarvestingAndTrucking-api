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

    // let whereClause: string[] = [];
    // let whereQuery: string = "";

    // if (search) {
    //   whereClause.push(`LOWER(c.name) LIKE LOWER('%${search}%')`);
    // }

    // for (let w of whereClause) {
    //   whereQuery += w;
    //   whereQuery += "!";
    // }

    // if (whereQuery) {
    //   whereQuery = whereQuery.slice(0, -1);
    //   whereQuery = whereQuery.replace(/!/g, " AND ");
    // }

    let crops_info_query = `
        SELECT 
            c."id",
            c."name",
            c."category",
            c."bushel_weight"

        FROM 
            "Crops" c
        ;`;
        // ${whereQuery ? "WHERE " + whereQuery : ""}

    let crops_count_query = `
        SELECT 
            COUNT(c."id")
        FROM 
            "Crops" c
        `;
    
    let query = `${crops_info_query} ${crops_count_query};`;
        // ${whereQuery ? "WHERE " + whereQuery : ""}
    db.connect();

    let result = await db.query(query);

    let resp = {
      crops: result[0].rows,
      count: +result[1].rows[0].count
    }

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
