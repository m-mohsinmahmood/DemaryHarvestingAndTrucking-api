import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { farm } from "./model";
// import { cropValidator } from "./validator";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {    
    //#region Validation
    const farm: farm = req.body;
    // const error = cropValidator(crop);
    // if (error.length > 0) throw { message: error };
    //#endregion
    //#region Query Execution
    let query = `
        INSERT INTO 
                  "Customer_Farm" 
                  ("customer_id", 
                  "name",
                  "status")
        VALUES 
                  ('${farm.customer_id}', 
                  '${farm.name}',
                  '${farm.status});
    `;
    db.connect();
    await db.query(query);
    db.end();
    //#endregion
    //#region Success Response
    context.res = {
      status: 200,
      body: {
        message: "Farm has been successfully created",
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
