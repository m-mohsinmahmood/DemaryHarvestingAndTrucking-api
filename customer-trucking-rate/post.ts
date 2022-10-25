import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { trucking_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const trucking_rate: trucking_rate = req.body;
    
    let query = `
      INSERT INTO 
                  "Trucking_Rates" 
                  (
                  "id",
                  "customer_id", 
                  "rate_type",
                  "rate"
                  ) 
       
      VALUES 
                  (
                  '${trucking_rate.customer_id}', 
                  '${trucking_rate.rate_type}',
                   ${trucking_rate.rate }
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Trucking Rate has been created successfully",
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
