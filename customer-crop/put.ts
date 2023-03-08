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
        UPDATE "Customer_Crop" 
        SET "customer_id"   = '${crop.customer_id}', 
            "crop_id"       = '${crop.crop_id}',
            "calendar_year" = '${crop.calendar_year}',
            "status"        =  ${crop.status},
            "modified_at"   = 'now()'
        WHERE 
            "id" = '${crop.id}';
        `;

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Crop has been updated successfully.",
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
