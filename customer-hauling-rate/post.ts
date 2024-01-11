import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { hauling_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db2 = new Client(config);


  try {
    await db.connect();
    await db2.connect();

    const hauling_rate: hauling_rate = req.body;

    let duplicationCheck = `
    SELECT farm_id, crop_id
    FROM "public"."Hauling_Rates"

    WHERE customer_id = '${req.body.customer_id}' AND farm_id = '${req.body.farm_id}' AND crop_id = '${req.body.crop_id}'
    AND is_deleted = FALSE
   ;
  `;

    const resultDuplicationCheck = await db2.query(duplicationCheck);

    if (resultDuplicationCheck.rowCount >= 1) {
      throw new Error("A record with the same farm and crop already exists.");
    }

    let query = `
      INSERT INTO "Hauling_Rates" 
                  ("customer_id",
                  "farm_id",
                  "crop_id", 
                  "rate_type",
                  "rate",
                  "base_rate",
                  "premium_rate",
                  "base_bushels",
                  "hauling_fuel_cost",
                  "truck_fuel_cost"
                  ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ;
    `;

    const values = [
      hauling_rate.customer_id,
      hauling_rate.farm_id,
      hauling_rate.crop_id,
      hauling_rate.rate_type,
      hauling_rate.rate ? hauling_rate.rate : 0,
      hauling_rate.base_rate ? hauling_rate.base_rate : 0,
      hauling_rate.premium_rate ? hauling_rate.premium_rate : 0,
      hauling_rate.base_bushels ? hauling_rate.base_bushels : 0,
      hauling_rate.hauling_fuel_cost,
      hauling_rate.truck_fuel_cost
    ];

    const result = await db.query(query, values);

    context.res = {
      status: 200,
      body: {
        message: "Hauling Rate has been created successfully",
      },
    };
  } catch (error) {
    context.res = {
      status: error.message === "A rate with the same farm and crop already exists." ? 409 : 500,
      body: {
        message: error.message,
      },
    };
  } finally {
    await db.end();
    await db2.end();
    context.done();
  }
};

export default httpTrigger;
