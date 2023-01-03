import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_setup } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query = ``;
  let query_1 = ``;
  let query_2 = ``;
  let query_3 = ``;
  const job_setup: job_setup = req.body;
  console.log('Req:',req.body)

  // query for customer job setup by crew-chief
  if (!job_setup.employee_id) {
     query = `${query}`;
  } 
    // for customer job setup by change of fields
  else {
    if(job_setup.has_employee){
      query = `${query_1} ${query_3}`;
    }else{
      query = `${query_2} ${query_3}`;
    }
  }
  try {
    // for customer job setup by crew-chief
     if(!job_setup.employee_id){
      console.log('IF Called')
      query = `
      INSERT INTO 
                  "Customer_Job_Setup" 
                  ("customer_id", 
                  "farm_id", 
                  "crop_id", 
                  "state", 
                  "field_id"
                  )
                  
      VALUES      ('${job_setup.customer_id}', 
                  '${job_setup.farm_id}', 
                  '${job_setup.crop_id}', 
                  '${job_setup.state}', 
                  '${job_setup.field_id}'
    );`;
     }
     // for customer job setup by change of fields
     else{
      console.log('ELSE Called')
      
      // to add the already selected/rendered field if employee is added
      query_1 = `
      UPDATE 
              "Customer_Job_Setup"
      SET 
             "customer_id"                    = '${job_setup.customer_id}', 
             "farm_id"                    = '${job_setup.farm_id}', 
              "crop_id"                     = '${job_setup.crop_id}',
              "state"                     = '${job_setup.state}',
              "field_id"                     = '${job_setup.field_id}',
              "employee_id"                     = '${job_setup.employee_id}',
              "total_gps_acres"                     = '${job_setup.total_gps_acres}',
              "is_field_changed"                     = '${job_setup.is_field_changed}',
              "has_employee"                     = 'true'

      WHERE 
              "employee_id" = '${job_setup.employee_id}' AND "is_field_changed" = 'false';`

      // to add the already selected/rendered field if employee not added
        query_2 = `
        INSERT INTO 
                    "Customer_Job_Setup" 
                    ("customer_id", 
                    "farm_id", 
                    "crop_id", 
                    "state", 
                    "field_id",
                    "employee_id",
                    "total_gps_acres",
                    "is_field_changed",
                    "has_employee"
                    )
                    
        VALUES      ('${job_setup.customer_id}', 
                    '${job_setup.farm_id}', 
                    '${job_setup.crop_id}', 
                    '${job_setup.state}', 
                    '${job_setup.field_id}',
                    '${job_setup.employee_id}',
                    '',
                    '${job_setup.is_field_changed}',
                    'true'
      );`;

      // to add the newly selected field
       query_3 = `
        INSERT INTO 
                    "Customer_Job_Setup" 
                    ("customer_id", 
                    "farm_id", 
                    "crop_id", 
                    "state", 
                    "field_id",
                    "employee_id",
                    "total_gps_acres",
                    "has_employee"
                    )
                    
        VALUES     ('${job_setup.customer_id}', 
                    '${job_setup.farm_id}', 
                    '${job_setup.crop_id}', 
                    '${job_setup.state}', 
                    '${job_setup.field_id_new}',
                    '${job_setup.employee_id}',
                    '${job_setup.total_gps_acres}',
                    'true'
      );`;
     }

    db.connect();
    console.log('Query:',query)
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
