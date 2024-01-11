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
    let duplicationCheck = `
    SELECT farm_id, crop_id
    FROM "public"."Combining_Rates"

    WHERE customer_id = '${req.body.customer_id}' AND farm_id = '${req.body.farm_id}' AND crop_id = '${req.body.crop_id}'
    AND is_deleted = FALSE
   ;
  `;

    db2.connect();
    const resultDuplicationCheck = await db2.query(duplicationCheck);

    if (resultDuplicationCheck.rowCount >= 1) {
      throw new Error("A record with the same farm and crop already exists.");
    }


    const combining_rate: combining_rate = req.body;
    let query = `
        UPDATE  "Combining_Rates"
        SET     "customer_id"    = '${combining_rate.customer_id}', 
                "farm_id"        = '${combining_rate.farm_id}',
                "crop_id"        = '${combining_rate.crop_id}',
                "combining_rate" =  ${combining_rate.combining_rate},
                "base_bushels"   =  ${combining_rate.base_bushels},
                "premium_rate"   =  ${combining_rate.premium_rate ? combining_rate.premium_rate : 0},
                "combining_fuel_cost"   =  ${combining_rate.combining_fuel_cost},
                "tractor_fuel_cost"   =  ${combining_rate.tractor_fuel_cost}
                
        WHERE   "id"             = '${combining_rate.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();
    db2.end();

    context.res = {
      status: 200,
      body: {
        message: "Combining Rate has been updated successfully.",
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
