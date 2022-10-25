import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const combining_rate_id: string = req.query.id;

    let combining_rates_query = `
        SELECT 
                cr."id", 
                c."id" as "crop_id",
                c."name" as "crop_name",
                c."bushel_weight", 
                cr."customer_id", 
                cr."combining_rate", 
                cr."base_bushels", 
                cr."premium_rate"
        FROM 
                "Combining_Rates" cr 
                INNER JOIN "Crops" c 
                ON cr."crop_id" = c."id"
        WHERE
                cr."id" = '${combining_rate_id}';

      `;

    db.connect();

    let result = await db.query(combining_rates_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No combining rate exists with this id.",
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
