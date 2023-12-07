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
      ON CONFLICT (farm_id, crop_id)
      DO NOTHING;
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
    context.done();
  }
};

export default httpTrigger;
