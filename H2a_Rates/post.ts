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
    //#region Validation
    const h2aRate: h2aRate = req.body;
    //#endregion
    //#region Query Execution
    let query = `
        INSERT INTO 
                  "H2a_Hourly_Rate" 
                  ("state", 
                  "hourly_rate")
        VALUES 
                  ('${h2aRate.state}', 
                  '${h2aRate.hourly_rate}');
    `;
    db.connect();
    await db.query(query);
    db.end();
    //#endregion
    //#region Success Response
    context.res = {
      status: 200,
      body: {
        message: "H2A Rate has been successfully created",
      },
    };
    context.done();
    return;
    //#endregion
  } catch (error) {
    //#region Error Response
    db.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    context.done();
    return;
    //#endregion
  }
};

export default httpTrigger;
