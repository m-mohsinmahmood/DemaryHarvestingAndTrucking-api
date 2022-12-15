import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_start } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const job_start: job_start = req.body;

    let query = `
      INSERT INTO 
                  "Customer_Job_Start" 
                  (
                  "machine_id",
                  "separator_hours", 
                  "engine_hours", 
                  "confirm_field")
                  
      VALUES      (
                 '${job_start.machine_id}', 
                  ${job_start.separator_hours}, 
                  ${job_start.engine_hours}, 
                  '${job_start.confirm_field}'
                 );
    `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Job has been started successfully",
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
