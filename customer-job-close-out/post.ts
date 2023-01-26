import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_close_out } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const job_close_out: job_close_out = req.body;

    let query = `
      INSERT INTO 
                  "Customer_Job_Close_Out" 
                  (
                  "date", 
                  "total_acres",
                  "total_gps_acres"
                  )
                  
      VALUES      (
                  '${job_close_out.date}', 
                  ${job_close_out.total_acres},
                  ${job_close_out.total_gps_acres}
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
