import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_setup,job_close } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query =``;

  try {
    const job_setup: job_setup = req.body;
    const job_close: job_close = req.body;
    console.log('Request:',req.body);

if (req.body.is_close) {
  query = `
         UPDATE 
                 "Customer_Job_Setup"
         SET 
                "customer_id"                    = '${job_close.customer_id}', 
                "close_job"                    = '${job_close.is_close}',
                 "date"                     = '${job_close.date}',
                 "total_acres"                     = '${job_close.total_acres}',
                 "total_gps_acres"                     = '${job_close.total_gps_acres}'
 
               
         WHERE 
                 "customer_id" = '${job_close.customer_id}';`
} else {
  let query = `
      UPDATE  "Customer_Job_Setup"
      SET     "customer_id"   = '${job_setup.customer_id}', 
              "farm_id"       = '${job_setup.farm_id}', 
              "crop_id"          = '${job_setup.crop_id}',
              "state"         = '${job_setup.state}', 
              "initial_field" = '${job_setup.field_id}'
      WHERE   "id"            = '${job_setup.id}';`  
}


    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Field has been updated successfully.",
        status: 200,

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
