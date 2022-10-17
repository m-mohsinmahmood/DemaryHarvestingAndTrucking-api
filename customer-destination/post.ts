import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { destination } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const destination: destination = req.body;
    
    let query = `
      INSERT INTO 
                  "Customer_Destination" 
                  ("customer_id", 
                  "farm_id",
                  "name", 
                  "calendar_year",
                  "status") 
       
      VALUES 
                  (
                  '${destination.customer_id}', 
                  '${destination.farm_id}',
                  '${destination.name}',
                   TO_DATE('${destination.calendar_year}', 'YYYY/MM/DD'),
                   ${destination.status}
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer destination has been created successfully",
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
