import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee_id: string = req.query.id;

    let dwr_info_query = `
          
    SELECT 
					
    hr.hourly_rate,
    dwr."state",
    dwr.created_at as date,
    dwr.hours_worked,
    emp."role",
    emp.id,
    emp.first_name,
    emp.last_name,
    emp.role



    from "DWR" dwr
    INNER JOIN "H2a_Hourly_Rate" hr
    on dwr."state" = hr."state"


    INNER JOIN "Employees" emp
    on dwr.employee_id = emp."id"
    
    where emp.id = '${employee_id}';
      `;

    let hours_count_query = `
    SELECT 
    SUM(CAST(hours_worked AS FLOAT)) 
    FROM "DWR" 
    WHERE employee_id = '${employee_id}';
      `;

    let query = `${dwr_info_query} ${hours_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      dwrTasks: result[0].rows,
      total_hours: +result[1].rows[0].sum,

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
