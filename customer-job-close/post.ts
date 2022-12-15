import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_close } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const job_close: job_close = req.body;

    let query = `
      INSERT INTO 
                  "Customer_Job_Close" 
                  (
                  "separator_hours", 
                  "engine_hours"
                  )
                  
      VALUES      (
                  '${job_close.separator_hours}', 
                  '${job_close.engine_hours}'
    );`;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Job has been closed successfully",
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
