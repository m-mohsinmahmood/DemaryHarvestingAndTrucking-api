import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const entityType: string = req.query.entityType;
  try {
    let data_query:any;
    let data_count_query: any;
    const search: string = req.query.search;
    let whereClause: string = `WHERE "is_deleted" = false`;

    if (search) whereClause = ` ${whereClause} And Lower("first_name") LIKE Lower('%${search}%')`;

    if(entityType === 'employee'){
        // for employee
        data_query = `
       SELECT 
       emp.first_name as "first_name",
       emp.last_name as "last_name",
       emp.id as "employee_id"
       FROM "Employees" emp
       ${whereClause}
           ;`;
   
       data_count_query = `
         SELECT 
                 COUNT("id") from
                 "Employees" 
   ;`;
    }else{
        // for supervisor
        data_query = `
        SELECT 
        emp.current_supervisor_reference as "supervisor",
        emp.id as "employee_id"
        FROM "Employees" emp
        ${whereClause}
            ;`;
    
        data_count_query = `
          SELECT 
                  COUNT("id") from
                  "Employees" 
    ;`;
    }

    let query = `${data_query} ${data_count_query}`;
console.log(query);
    db.connect();

    let result = await db.query(query);

    let resp = {
      employees: result[0].rows,
      count: +result[1].rows[0].count,
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