import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { combining_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const combining_rate: combining_rate = req.body;

    let query = `
      INSERT INTO 
                  "Combining_Rates" 
                  (
                  "customer_id", 
                  "farm_id",
                  "crop_id",
                  "combining_rate",
                  "base_bushels",
                  "premium_rate"
                  ) 
       
      VALUES 
                  (
                  '${combining_rate.customer_id}', 
                  '${combining_rate.farm_id}',
                  '${combining_rate.crop_id}',
                  '${combining_rate.combining_rate}',
                   ${combining_rate.base_bushels},
                   ${combining_rate.premium_rate ? combining_rate.premium_rate : 0}
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Combining Rate has been created successfully",
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
