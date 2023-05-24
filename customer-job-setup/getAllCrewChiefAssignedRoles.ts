import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const crew_chief_id = req.query.crew_chief_id;
  const role = req.query.role;

  try {

    let assigned_roles_info_query = `
    select 

    emp."id" as employee_id,
    concat(emp.first_name, ' ', emp.last_name) as employee_name
    
    from "Harvesting_Assigned_Roles"  har
    
    INNER JOIN "Employees" emp ON emp.id::VARCHAR = har.employee_id
    
    where
    har.crew_chief_id = '${crew_chief_id}'
    AND har.role = '${role}'
    ;
      `;

    let assigned_roles_info_query_count = `
    select 

    Count(emp."id") 
    
    from "Harvesting_Assigned_Roles"  har
    
    INNER JOIN "Employees" emp ON emp.id::VARCHAR = har.employee_id
    
    where
    har.crew_chief_id = '${crew_chief_id}'
    AND har.role = '${role}'
      ;`;

    let query = `${assigned_roles_info_query} ${assigned_roles_info_query_count}`;
    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      assigned_roles: result[0].rows,
      count: result[1].rows,
      status: 200,
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
