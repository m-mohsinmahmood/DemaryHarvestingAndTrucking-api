import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { field } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const field: field = req.body;
    
    let query = `
      INSERT INTO 
                  "Customer_Field" 
                  ("customer_id", 
                  "farm_id",
                  "name", 
                  "acres",
                  "calendar_year") 
       
      VALUES 
                  (
                  '${field.customer_id}', 
                  '${field.farm_id}',
                  '${field.name}',
                  ${field.acres},
                  TO_DATE('${field.calendar_year}', 'YYYY/MM/DD')
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer field has been created successfully",
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
