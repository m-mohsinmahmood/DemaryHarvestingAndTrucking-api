import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { combining_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db2 = new Client(config);

  try {
    await db2.connect();

    let duplicationCheck = `
    SELECT farm_id, crop_id
    FROM "public"."Combining_Rates"

    WHERE customer_id = '${req.body.customer_id}' AND farm_id = '${req.body.farm_id}' AND crop_id = '${req.body.crop_id}'
    AND is_deleted = FALSE
   ;
  `;

    const resultDuplicationCheck = await db2.query(duplicationCheck);

    if (resultDuplicationCheck.rowCount >= 1) {
      throw new Error("A record with the same farm and crop already exists.");
    }

    await db.connect();

    const combining_rate: combining_rate = req.body;

    let query = `
      INSERT INTO "Combining_Rates" (
        "customer_id", 
        "farm_id",
        "crop_id",
        "combining_rate",
        "base_bushels",
        "premium_rate",
        "combining_fuel_cost",
        "tractor_fuel_cost"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ;
    `;

    const values = [
      combining_rate.customer_id,
      combining_rate.farm_id,
      combining_rate.crop_id,
      combining_rate.combining_rate,
      combining_rate.base_bushels,
      combining_rate.premium_rate ? combining_rate.premium_rate : 0,
      combining_rate.combining_fuel_cost,
      combining_rate.tractor_fuel_cost
    ];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      throw new Error("A record with the same farm and crop already exists.");
    }

    context.res = {
      status: 200,
      body: {
        message: "Combining Rate has been created successfully",
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
