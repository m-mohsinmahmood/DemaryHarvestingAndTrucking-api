import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { hauling_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const hauling_rate: hauling_rate = req.body;
    
    let query = `
      INSERT INTO 
                  "Hauling_Rates" 
                  ("customer_id",
                  "farm_id",
                  "crop_id", 
                  "rate_type",
                  "rate",
                  "base_rate",
                  "premium_rate",
                  "base_bushels") 
       
      VALUES 
                  (
                  '${hauling_rate.customer_id}', 
                  '${hauling_rate.farm_id}',
                  '${hauling_rate.crop_id}',
                  '${hauling_rate.rate_type}',
                   ${hauling_rate.rate ? hauling_rate.rate : 0 },
                   ${hauling_rate.base_rate ? hauling_rate.base_rate : 0},
                   ${hauling_rate.premium_rate ? hauling_rate.premium_rate : 0},
                   ${hauling_rate.base_bushels ? hauling_rate.base_bushels : 0}
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
