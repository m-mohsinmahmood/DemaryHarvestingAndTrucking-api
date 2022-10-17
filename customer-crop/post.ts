import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { crop } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const crop: crop = req.body;
    
    let query = `
      INSERT INTO 
                  "Customer_Crop" 
                  ("customer_id", 
                  "crop_id",
                  "calendar_year",
                  "status") 
       
      VALUES 
                  ('${crop.customer_id}', 
                  '${crop.crop_id}',
                  TO_DATE('${crop.calendar_year}', 'YYYY/MM/DD'),
                  '${crop.status}'
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer crop has been created successfully",
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
