import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {

    const h2a_rate_id: string = req.query.id;

    let h2a_rate_info_query = `
        SELECT 
              "id", 
              "state", 
              "hourly_rate" 
        FROM 
            "H2a_Hourly_Rate"
        WHERE 
            "id" = '${h2a_rate_id}';
        `;

    db.connect();

    let result = await db.query(h2a_rate_info_query);
    let resp;
    if (result.rows.length > 0)
      resp = result.rows[0];
    else
      resp = {
        message: "No Rate exists with this id."
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
