import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_close } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
let query =``;

  try {
    const job_close: job_close = req.body;
    if(job_close.role === 'kart-operator'){
       query = `
      INSERT INTO 
                  "Customer_Job_Close" 
                  (
                  "engine_hours",
                  "role"
                  )
                  
      VALUES      (
                  ${job_close.engine_hours},
                  '${job_close.role}'
    );`;
    }
    else if(job_close.role === 'truck-driver'){
       query = `
      INSERT INTO 
                  "Customer_Job_Close" 
                  (
                  "ending_miles",
                  "role"
                  )
                  
      VALUES      (
                  ${job_close.ending_miles},
                  '${job_close.role}'
    );`;
    }
    else{
       query = `
        INSERT INTO 
                    "Customer_Job_Close" 
                    (
                    "separator_hours", 
                    "engine_hours",
                    "role"
                    )
                    
        VALUES      (
                    ${job_close.separator_hours}, 
                    ${job_close.engine_hours},
                    '${job_close.role}'
      );`;
    }


    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Job has been completed successfully",
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
