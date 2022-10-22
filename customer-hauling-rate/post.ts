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
                  "Hauling_Rates" 
                  ("customer_id", 
                  "crop_id",
                  "rate_type", 
                  "base_rate",
                  "premium_rate") 
       
      VALUES 
                  (
                  '${field.customer_id}', 
                  '${field.crop_id}',
                  '${field.rate_type}',
                  '${field.base_rate}',
                  '${field.premium_rate}'
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Hauling Rate has been created successfully",
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
