import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_start } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  console.log("Req:", req.body);

  let query = ``;
  try {
    const job_start: job_start = req.body;

    if (job_start.role === "truck-driver") {
      query = `
      INSERT INTO 
                  "Customer_Job_Start" 
                  (
                  "role",
                  "truck_id",
                  "crew_chief",
                  "truck_company",
                  "begining_miles"
                  )
                  
      VALUES      (
                 '${job_start.role}', 
                 '${job_start.truck_id}', 
                 '${job_start.crew_chief}',
                 '${job_start.truck_company}',
                  ${job_start.begining_miles}
                 );
    `;
    } else if (job_start.role === "kart-operator") {
      query = `
      INSERT INTO 
                  "Customer_Job_Start" 
                  (
                  "role",
                  "machine_id",
                  "engine_hours"
                  )
                  
      VALUES      (
                 '${job_start.role}', 
                 '${job_start.machine_id}', 
                  ${job_start.engine_hours}
                 );
    `;
    } else {
      query = `
      INSERT INTO 
                  "Customer_Job_Start" 
                  (
                  "role",
                  "machine_id",
                  "separator_hours", 
                  "engine_hours", 
                  "confirm_field")
                  
      VALUES      (
                 '${job_start.role}', 
                 '${job_start.machine_id}', 
                  ${job_start.separator_hours}, 
                  ${job_start.engine_hours}, 
                  '${job_start.confirm_field}'
                 );
    `;
    }

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
