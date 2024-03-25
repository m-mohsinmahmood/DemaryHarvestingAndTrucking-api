import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { h2aRate } from "./model";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  try {
    const h2aRate: h2aRate = req.body;
    let query = `
        UPDATE "H2a_Hourly_Rate" 
        SET  
            "hourly_rate"   = '${h2aRate.hourly_rate}',
            "rate_type"     = '${h2aRate.rate_type}',  
            "modified_at"   = 'now()',
            "year"          = '${h2aRate.year}'

        WHERE 
            "id" = '${h2aRate.id}';
        `;

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "H2A Rate has been updated successfully.",
      },
    };
    context.done();
    return;
  } catch (error) {
    db.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    return;
  }
};

export default httpTrigger;
