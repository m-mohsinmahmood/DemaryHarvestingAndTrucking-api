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

    // to get the opened/not-closed jobs of combine operator
    if (entity.includes("Combine Operator")) {
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

    else if (entity.includes("Truck Driver")) {
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
