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
  // const jobId = req.body.job_id;

  try {

    if (job_setup.combine_operator_id != null || job_setup.cart_operator_id != null) {
      // Assign Roles
      // let assign = `INSERT INTO 
      // "Customer_Job_Assigned_Roles" 
      // ("job_id", 
      // "employee_id"
      // )
      // VALUES      
      // ('${job_setup.job_id}', 
      // '${job_setup.employee_id}'
      // );`;

      if (job_setup.combine_operator_id) {
        query = `
        UPDATE 
            "Employees"
        SET 
            "dht_supervisor_id" = '${job_setup.crew_chief_id}'
        WHERE 
            "id" = '${job_setup.combine_operator_id}' ;

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
            
            `;
      }
    }

    else {
      // Before creating new job for crew chief, close or complete the last active job of that crew chief 

      // if (job_setup.changeFarmFieldCrop) {
      //   query = `
      //   Update "Employees" Set dht_supervisor_id = '' 
      //   from (SELECT assigned.employee_id from "Customer_Job_Setup" cjs 
      //   INNER JOIN "Customer_Job_Assigned_Roles" assigned ON cjs."id" = assigned.job_id AND cjs."id" = '${jobId}') as query
      //   where CAST("Employees"."id" as VARCHAR) = query.employee_id;
      //   `;
      // }

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
        "id" = '${job_setup.job_id}';`;
      }

      if (job_setup.newJobSetup) {
        query = `
      
        ${query}
        INSERT INTO 
        "Customer_Job_Setup" 
        ("customer_id", 
        "farm_id", 
        "crop_id",
        "director_id",
        "state", 
        "crew_chief_id",
        "is_job_active",
        "crop_acres",
        "crop_gps_acres"
        )
        
        VALUES      
        ('${job_setup.customer_id}', 
        '${job_setup.farm_id}', 
        '${job_setup.crop_id}', 
        '${job_setup.director_id}',
        '${job_setup.state}', 
        '${job_setup.crew_chief_id}',
        'True',
        '${job_setup.total_acres}',
        '${job_setup.total_gps_acres}'
        )
        RETURNING id as record_id
        ;

        UPDATE 
        "DWR_Employees"
                
        SET 
        "supervisor_id" = '${job_setup.director_id}',
        "module" = 'harvesting',
        "modified_at" = CURRENT_TIMESTAMP
                     
        WHERE 
        "id" = '${job_setup.active_check_in_id}' ;
        
        INSERT INTO "User_Profile" (employee_id, state, customer_id, farm_id, crop_id, director_id)
        VALUES ('${job_setup.employee_id}', '${job_setup.state}', '${job_setup.customer_id}', '${job_setup.farm_id}', '${job_setup.crop_id}', '${job_setup.director_id}')
        ON CONFLICT (employee_id) DO UPDATE SET state = EXCLUDED.state, customer_id = EXCLUDED.customer_id, farm_id = EXCLUDED.farm_id, crop_id = EXCLUDED.crop_id, director_id = EXCLUDED.director_id;
        `;
      }
    }

    query = `${query}`;

    db.connect();
    console.log("Query:", query);
    let result = await db.query(query);

    if (result[0]) {
      result = result[0].rows[0]
    }

    context.res = {
      status: 200,
      body: {
        id:result,
        message: "Job has been created successfully",
        status: 200,
      },
    };
    ;
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
  }
  finally {
    db.end();
    context.done();
  }
};

export default httpTrigger;
