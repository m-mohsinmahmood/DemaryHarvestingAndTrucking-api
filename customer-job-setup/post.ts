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
      INSERT INTO 
                  "Customer_Job_Setup" 
                  ("customer_id", 
                  "farm_id", 
                  "crop_id", 
                  "state", 
                  "initial_field")
                  
      VALUES      ('${job_setup.customer_id}', 
                  '${job_setup.farm_id}', 
                  '${job_setup.crop_id}', 
                  '${job_setup.state}', 
                  '${job_setup.initial_field}'
    );`;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Job has been created successfully",
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
