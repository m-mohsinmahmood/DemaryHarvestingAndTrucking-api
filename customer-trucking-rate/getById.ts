import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const trucking_rate_id: string = req.query.id;

    let trucking_rates_query = `
        SELECT 
                "customer_id", 
                "rate_type",
                "rate"
        FROM 
                "Trucking_Rates"

        WHERE
                "id" = '${trucking_rate_id}';

      `;

    db.connect();

    let result = await db.query(trucking_rates_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No trucking rate exists with this id.",
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
