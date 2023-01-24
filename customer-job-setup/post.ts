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
  const job_setup: job_setup = req.body;

  try {

    if (job_setup.combine_operator_id != null || job_setup.cart_operator_id != null) {
      // Assign Roles
      let assign = `INSERT INTO 
      "Customer_Job_Assigned_Roles" 
      ("job_id", 
      "employee_id"
      )
      VALUES      
      ('${job_setup.job_id}', 
      '${job_setup.employee_id}'
      );`;

      if (job_setup.combine_operator_id) {
        query = `
        UPDATE 
            "Employees"
        SET 
            "dht_supervisor_id" = '${job_setup.crew_chief_id}'
        WHERE 
            "id" = '${job_setup.combine_operator_id}' ;

            ${assign}
            `;
      }

      if (job_setup.cart_operator_id) {
        query = `${query} 
        UPDATE 
            "Employees"
        SET 
            "dht_supervisor_id" = '${job_setup.crew_chief_id}'
        WHERE 
            "id" = '${job_setup.cart_operator_id}' ;
            
            ${assign}
            `;
      }
    }

    else {
      // Before creating new job for crew chief, close or complete the last active job of that crew chief 

      if (job_setup.changeFarmFieldCrop) {
        query = `UPDATE "Employees" Set dht_supervisor_id = '' where dht_supervisor_id = '${job_setup.crew_chief_id}';`;
      }

      if (job_setup.closeJob) {
        query = `
      
        ${query}
        UPDATE 
        "Customer_Job_Setup"
        SET 
        "is_job_active"     = false, 
        "is_job_completed"  = true,
        "crop_acres" = '${job_setup.total_acres}',
        "crop_gps_acres" = '${job_setup.total_gps_acres}'
      
        WHERE 
        "crew_chief_id" = '${job_setup.crew_chief_id}' AND is_job_active = TRUE AND is_job_completed = FALSE;`;
      }

      if (job_setup.newJobSetup) {
        query = `
      
        ${query}
        INSERT INTO 
        "Customer_Job_Setup" 
        ("customer_id", 
        "farm_id", 
        "crop_id", 
        "state", 
        "field_id",
        "crew_chief_id",
        "is_job_active",
        "crop_acres",
        "crop_gps_acres"
        )
        
        VALUES      
        ('${job_setup.customer_id}', 
        '${job_setup.farm_id}', 
        '${job_setup.crop_id}', 
        '${job_setup.state}', 
        '${job_setup.field_id}',
        '${job_setup.crew_chief_id}',
        'True',
        '${job_setup.total_acres}',
        '${job_setup.total_gps_acres}'
        
        );`;
      }
    }
    // // for customer job setup by change of fields
    // else {
    //   // to add the already selected/rendered field if employee is added
    //   query_1 = `
    //   UPDATE 
    //           "Customer_Job_Setup"
    //   SET 
    //           "customer_id"                     = '${job_setup.customer_id}',
    //           "farm_id"                     = '${job_setup.farm_id}',
    //           "crop_id"                     = '${job_setup.crop_id}',
    //           "state"                     = '${job_setup.state}',
    //           "field_id"                     = '${job_setup.field_id}',
    //           "employee_id"                     = '${job_setup.employeeId}',
    //           "total_acres"                     = '${job_setup.total_acres === undefined ? "" : job_setup.total_acres}',
    //           "total_gps_acres"                     = '${job_setup.total_gps_acres}',
    //           "is_field_changed"                     = true,
    //           "has_employee"                     = 'true'

    //   WHERE 
    //           "employee_id" = '${job_setup.employeeId}';`;

    //   // inserting all in new table to get with  job_id
    //   query_2 = `
    //   INSERT INTO 
    //               "Customer_Job_Setup_All" 
    //               ("customer_id", 
    //               "farm_id", 
    //               "crop_id", 
    //               "state", 
    //               "field_id",
    //               "employee_id",
    //               "total_acres",
    //               "total_gps_acres",
    //               "is_field_changed",
    //               "job_id"
    //               )

    //   VALUES      ('${job_setup.customer_id}', 
    //               '${job_setup.farm_id}', 
    //               '${job_setup.crop_id}', 
    //               '${job_setup.state}', 
    //               '${job_setup.field_id}',
    //               '${job_setup.employeeId}',
    //               '${
    //                 job_setup.total_acres === undefined
    //                   ? ""
    //                   : job_setup.total_acres
    //               }',
    //               '${job_setup.total_gps_acres}',
    //               '${job_setup.is_field_changed}',
    //               '${job_setup.job_id}'
    // );`;

    //   // to add the newly selected field
    //   query_3 = `
    //     INSERT INTO 
    //                 "Customer_Job_Setup" 
    //                 ("customer_id", 
    //                 "farm_id", 
    //                 "crop_id", 
    //                 "state", 
    //                 "field_id",
    //                 "employee_id",
    //                 "total_acres",
    //                 "total_gps_acres",
    //                 "has_employee"
    //                 )

    //     VALUES     ('${job_setup.customer_id}', 
    //                 '${job_setup.farm_id}', 
    //                 '${job_setup.crop_id}', 
    //                 '${job_setup.state}', 
    //                 '${job_setup.field_id_new}',
    //                 '${job_setup.employeeId}',
    //                 '',
    //                 '',
    //                 'true'
    //   );`;
    // }

    query = `${query}`;

    db.connect();
    console.log("Query:", query); +
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
