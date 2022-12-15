import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { change_field } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const change_field: change_field = req.body;

    let query = `
      INSERT INTO 
                  "Customer_Change_Field" 
                  (
                  "field_id",
                  "acres", 
                  "acres_completed"
                  )
                  
      VALUES      (
                 '${change_field.field_id}', 
                  ${change_field.acres}, 
                  ${change_field.acres_completed}
                 );
    `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Field has been changed successfully",
        status: 200,
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
