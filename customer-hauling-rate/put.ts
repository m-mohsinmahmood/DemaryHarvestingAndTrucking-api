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
    let duplicationCheck = `
    SELECT farm_id, crop_id
    FROM "public"."Hauling_Rates"

    WHERE customer_id = '${req.body.customer_id}' AND farm_id = '${req.body.farm_id}' AND crop_id = '${req.body.crop_id}'
    AND is_deleted = FALSE
   ;
  `;

    db2.connect();
    const resultDuplicationCheck = await db2.query(duplicationCheck);

    if (resultDuplicationCheck.rowCount >= 1) {
      throw new Error("A record with the same farm and crop already exists.");
    }

    const hauling_rate: hauling_rate = req.body;
    let query = `
        UPDATE  "Hauling_Rates"
        SET     "customer_id"  = '${hauling_rate.customer_id}', 
                "farm_id"      = '${hauling_rate.farm_id}',
                "crop_id"      = '${hauling_rate.crop_id}',   
                "rate_type"    = '${hauling_rate.rate_type}',
                "rate"         =  ${hauling_rate.rate ? hauling_rate.rate : 0},
                "base_rate"    =  ${hauling_rate.base_rate ? hauling_rate.base_rate : 0}, 
                "premium_rate" =  ${hauling_rate.premium_rate ? hauling_rate.premium_rate : 0},
                "base_bushels" =  ${hauling_rate.base_bushels ? hauling_rate.base_bushels : 0},
                "hauling_fuel_cost"    = '${hauling_rate.hauling_fuel_cost}',
                "truck_fuel_cost"    = '${hauling_rate.truck_fuel_cost}'
                
        WHERE   "id"           = '${hauling_rate.id}';`

    db.connect();

    let result = await db.query(query);
    db.end();
    db2.end();

    context.res = {
      status: 200,
      body: {
        message: "Hauling Rate has been updated successfully.",
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
