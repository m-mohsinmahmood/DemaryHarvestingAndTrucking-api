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

    let dwr_info_query1 = `
    Select
hr.hourly_rate,
tdt.destination_state as state,
dwr.created_at as date,
emp."id",
emp.first_name,
emp.last_name,
emp."role",
dwr.hours_worked,
dwr.crew_chief as supervisor

FROM
	"DWR" dwr
	INNER JOIN "Trucking_Delivery_Ticket" tdt ON dwr.delivery_ticket_id = tdt."id"
	INNER JOIN "H2a_Hourly_Rate" hr ON tdt.destination_state = hr."state"
	INNER JOIN "Employees" emp ON dwr.employee_id = emp."id" 
WHERE
	dwr.employee_id = '${employee_id}' 
	AND dwr.created_at >= now( ) - INTERVAL '14 DAYS'; `;
    let dwr_info_query2 = `
SELECT
	hr.hourly_rate,
	fwo.STATE as state,
	dwr.created_at as date,
	emp."id",
	emp.first_name,
	emp.last_name,
	emp."role",
	dwr.hours_worked,
  dwr.supervisor_id as supervisor
FROM
	"DWR" dwr
	INNER JOIN "Farming_Work_Order" fwo ON dwr.work_order_id = fwo."id"
	INNER JOIN "H2a_Hourly_Rate" hr ON fwo."state" = hr."state"
	INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
  WHERE dwr.employee_id = '${employee_id}' 
	AND dwr.created_at >= now( ) - INTERVAL '14 DAYS';
`;


let dwr_info_query3 = `
SELECT
	hr.hourly_rate,
	CONCAT ( crew.first_name , crew.last_name) as supervisor,
	hr."state",
	dwr.created_at,
	emp."id",
	emp.first_name,
	emp.last_name,
	emp."role",
	dwr.hours_worked 
FROM
	"DWR" dwr
	INNER JOIN "Customer_Job_Setup" cjs ON dwr.job_id = cjs."id"
	INNER JOIN "H2a_Hourly_Rate" hr ON cjs."state" = hr."state"
	INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
	INNER JOIN "Employees" crew ON cjs.crew_chief_id = emp."id"
WHERE
  dwr.employee_id = '${employee_id}' 
	AND dwr.created_at >= now( ) - INTERVAL '14 DAYS';
`;




    let hours_count_query = `
    SELECT 
    SUM(CAST(hours_worked AS FLOAT)) 
    FROM "DWR" 
    WHERE employee_id = '${employee_id}';
      `;

    let query = `${dwr_info_query1} ${dwr_info_query2} ${dwr_info_query3} ${hours_count_query}`;

    db.connect();

    let result = await db.query(query);
    let tempDwrTasks = [];
    tempDwrTasks.push(result[0].rows);
    tempDwrTasks.push(result[1].rows);
    tempDwrTasks.push(result[2].rows);

    let resp = {
      dwrTasks: tempDwrTasks,
      total_hours: +result[3].rows[0].sum,

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
