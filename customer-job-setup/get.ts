import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const entity: string = req.query.entity;
  const employeeId: string = req.query.employeeId;
  const crew_chief_id: string = req.query.crew_chief_id;

  console.log(req.query);

  try {
    let query = ``;

    // to get the opened/not-closed jobs of crew chief
    if (entity === "crew-chief") {
      query = `

      select 

      "job_setup".id,
      "job_setup".state,
      "job_setup".customer_id,
      "job_setup".farm_id,
      "job_setup".field_id,
      job_setup.crop_id,
      farm."name" as farm_name,
      crop."name" as crop,
      field."name" as field_name,
      customers.customer_name

      from "Customer_Job_Setup" job_setup
      INNER JOIN "Customers" customers
      on job_setup.customer_id = customers.id

      INNER JOIN "Customer_Farm" farm
      on farm.id = job_setup.farm_id

      INNER JOIN "Crops" crop
      on crop.id = job_setup.crop_id

      INNER JOIN "Customer_Field" field
      on field.id = job_setup.field_id

      WHERE crew_chief_id = '${crew_chief_id}' AND is_job_active = true AND is_job_completed = false;
      `;

    }

    // to get the opened/not-closed jobs of combine operator
    else if (entity === "combine-operator") {
      query = `
      select

      cjs.id,
      cjs.state,
      cjs.customer_id,
      cjs.farm_id,
      cjs.field_id,
      cjs.crop_id,
      farm."name" as farm_name,
      crop."name" as crop,
      field."name" as field_name,
      field.acres as field_acres,
      customers.customer_name,
      emp.first_name as crew_chief_name
       
     from "Customer_Job_Setup" cjs 
 
     INNER JOIN "Customers" customers on cjs.customer_id = customers.id
 
     INNER JOIN "Customer_Job_Assigned_Roles" assigned ON cjs."id" = assigned.job_id AND assigned.employee_id = '${employeeId}'
 
     INNER JOIN "Employees" emp on emp.id = cjs.crew_chief_id
 
     INNER JOIN "Customer_Farm" farm on farm.id = cjs.farm_id
 
     INNER JOIN "Crops" crop on crop.id = cjs.crop_id
 
     INNER JOIN "Customer_Field" field on field.id = cjs.field_id
  
     WHERE is_job_active = true AND is_job_completed = false;
     `;
    }

    else if (entity === "truck-driver") {
      query = `
     select

     cjs.id,
     cjs.state,
     cjs.customer_id,
     cjs.farm_id,
     cjs.field_id,
     cjs.crop_id,
     farm."name" as farm_name,
     crop."name" as crop,
     field."name" as field_name,
     field.acres as field_acres,
     customers.customer_name,
     emp.first_name as crew_chief_name
			
    from "Customer_Job_Setup" cjs 

    INNER JOIN "Customers" customers on cjs.customer_id = customers.id

    INNER JOIN "Customer_Job_Assigned_Roles" assigned ON cjs."id" = assigned.job_id AND assigned.employee_id = '${employeeId}'

    INNER JOIN "Employees" emp on emp.id = cjs.crew_chief_id

    INNER JOIN "Customer_Farm" farm on farm.id = cjs.farm_id

    INNER JOIN "Crops" crop on crop.id = cjs.crop_id

    INNER JOIN "Customer_Field" field on field.id = cjs.field_id
 
    WHERE is_job_active = true AND is_job_completed = false;
     `;
    }

    else if (entity === "kart-operator") {
      query = `
      select 
      
      "job_setup".id,
     "job_setup".state,
     "job_setup".customer_id,
     "job_setup".farm_id,
      job_setup.crop_id,
      farm."name" as farm_name,
      crop."name" as crop,
      customers.customer_name,
      emp.first_name as crew_chief_name
 
      from "Customer_Job_Setup" job_setup
      
      INNER JOIN "Customers" customers
      on job_setup.customer_id = customers.id
       
      INNER JOIN "Employees" emp
      on emp.id = job_setup.crew_chief_id

      INNER JOIN "Customer_Farm" farm
      on farm.id = job_setup.farm_id

      INNER JOIN "Crops" crop
      on crop.id = job_setup.crop_id
     
      INNER JOIN "Customer_Job_Assigned_Roles" assigned
      on job_setup.id = assigned.job_id AND assigned.employee_id = '${employeeId}'
 
      WHERE crew_chief_id = '${crew_chief_id}' AND is_job_active = true AND is_job_completed = false;
     `;
    }

    else if (entity === "truck-driver-active-tickets") {
      const isTicketActive: string = req.query.isTicketActive;
      const isPreCHeckFilled: string = req.query.isPreCheckFilled;
      let whereClause = ``;

      if (isTicketActive) whereClause = ` ${whereClause}  And cjs.is_dwr_made=${isTicketActive}`;
      if (isPreCHeckFilled) whereClause = ` ${whereClause}  And is_trip_check_filled=${isPreCHeckFilled}`;

      query = `
      select 
      cjs."id" as "id",
      CUS.customer_name as "customerName",
      dwr.machinery_id as truck_id
      from "Customer_Job_Setup"  cjs
			
      INNER JOIN "Customers" cus ON cus."id" = cjs.customer_id
      INNER JOIN "DWR" dwr ON cjs.id = dwr.job_id 
       
      where dwr.employee_id = '${employeeId}'
      ${whereClause}
      ;`;
    }

    // to get the opened/not-closed jobs of kart operator
    // else if (entity === "kart-operator") {
    //   // to get the opened/not-closed jobs of kart operator if employee is present
    //   query = `
    //     SELECT 
    //      customer."id" as "customer_id", 
    //      wo."state" as "state",
    //      wo."id" as "job_id",
		// 		 wo."employee_id" as "employee_id",
    //      wo."has_employee" as "has_employee", 
    //      wo."is_close_kart" as "is_close_kart",
    //      customer."customer_name" as "customer_name",
    //       farm."name" as "farm_name",
    //       farm."id" as "farm_id",
    //       crop."name" as "crop_name",
    //       crop."id" as "crop_id",
    //       field."name" as "field_name",
    //       field."id" as "field_id"
    //      FROM 
         
    //      "Customer_Job_Setup" wo
         
    //      INNER JOIN "Customers" customer 
    //      ON wo."customer_id" = customer."id"
     
    //      INNER JOIN "Customer_Farm" farm 
    //      ON wo."farm_id" = farm."id"
         
    //      INNER JOIN "Crops" crop 
    //      ON wo."crop_id" = crop."id"
         
    //      INNER JOIN "Customer_Field" field 
    //      ON wo."field_id" = field."id"
    //      WHERE
    //      employee_id = '${employeeId}' AND "is_field_changed" = FALSE `;

    //   // to get the opened/not-closed jobs of kart operator if employee is not present
    //   query = `
    //     SELECT 
    //      customer."id" as "customer_id", 
    //      wo."state" as "state",
    //      wo."id" as "job_id",
		// 		 wo."employee_id" as "employee_id",
    //      wo."has_employee" as "has_employee", 
    //      wo."is_close_kart" as "is_close_kart",
    //      customer."customer_name" as "customer_name",
    //       farm."name" as "farm_name",
    //       farm."id" as "farm_id",
    //       crop."name" as "crop_name",
    //       crop."id" as "crop_id",
    //       field."name" as "field_name",
    //       field."id" as "field_id"
    //      FROM 
         
    //      "Customer_Job_Setup" wo
         
    //      INNER JOIN "Customers" customer 
    //      ON wo."customer_id" = customer."id"
     
    //      INNER JOIN "Customer_Farm" farm 
    //      ON wo."farm_id" = farm."id"
         
    //      INNER JOIN "Crops" crop 
    //      ON wo."crop_id" = crop."id"
         
    //      INNER JOIN "Customer_Field" field 
    //      ON wo."field_id" = field."id"
    //      WHERE
    //      "is_field_changed" = FALSE `;
    // }
    // query if employee is present
    query = `${query}`;

    console.log("Query: ", query);

    db.connect();

    let result = await db.query(query);
    // conditionally checking if rows are zero
    if (result.rowCount === 0) {

      // query if employee is not present
      query = `${query}`;
      result = await db.query(query);
    }
    let resp = {
      customer_job: result.rows
    };

    db.end();

    context.res = {
      status: 200,
      body: resp,
    };

    context.done();
    return;
  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    context.done();
    return;
  }
};

export default httpTrigger;
