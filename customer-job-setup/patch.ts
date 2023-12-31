import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { rawListeners } from "process";
import { config } from "../services/database/database.config";
import { job_update, job_close } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query = ``;
  try {
    const job_update: job_update = req.body;
    const job_close: job_close = req.body;
    console.log('Request::',req.body);
    
      query = `
         UPDATE 
                 "Customer_Job_Setup"
         SET 
                "customer_id"                    = '${job_update.customer_id}', 
                "farm_id"                    = '${job_update.farm_id}',
                 "crop_id"                     = '${job_update.crop_id}'
        
         WHERE 
                 "customer_id" = '${job_update.customer_id}';`
           console.log('Query:',query)
                db.connect();
                let result = await db.query(query);
                db.end();
            
                context.res = {
                  status: 200,
                  body: {
                    message: "Job has been closed successfully.",
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
            