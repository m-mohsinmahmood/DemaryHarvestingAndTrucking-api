import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_setup } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const job_setup: job_setup = req.body;

    let query = `
        UPDATE  "Customer_Job_Setup"
        SET     "customer_id"   = '${job_setup.customer_id}', 
                "farm_id"       = '${job_setup.farm_id}', 
                "crop_id"          = '${job_setup.crop_id}',
                "state"         = '${job_setup.state}', 
                "initial_field" = '${job_setup.initial_field}'
        WHERE   "id"            = '${job_setup.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Field has been updated successfully.",
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
