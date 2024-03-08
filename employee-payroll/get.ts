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
    let year = req.query.year;
    let state = req.query.state;

    let whereClause = `Where`;
    if (state) whereClause = ` ${whereClause}LOWER("state") LIKE LOWER('%${state}%') AND`;
    else
      whereClause = ` ${whereClause} state = 'Arizona' AND`;

    if (!year)
      year = `(SELECT EXTRACT(YEAR from now()))`

    let dwr_info_query1 = `
    SELECT
    hr.hourly_rate,
    CONCAT(sup.first_name, ' ', sup.last_name) AS supervisor,
    dwr_emp.begining_day AS DATE,
    dwr_emp.ending_day AS endday,
    emp."id",
    emp.first_name,
    emp.last_name,
    emp."role",
    ROUND(CAST(EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600 AS NUMERIC), 2) AS hours_worked,
    dwr_emp."state" 
FROM

    "Bridge_DailyTasks_DWR" bridge
    JOIN "DWR_Employees" dwr_emp ON dwr_emp."id" = bridge.dwr_id 
    INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
    INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state" AND Extract(YEAR from hr.year) = ${year} 
    INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_emp.employee_id
    INNER JOIN "Employees" sup ON sup."id"::VARCHAR = dwr_emp.supervisor_id
    
WHERE
    dwr.employee_id = '${employee_id}' 
    AND dwr_emp.begining_day >= now() - INTERVAL '10 DAYS' 
GROUP BY
    hr.hourly_rate,
    CONCAT(sup.first_name, ' ', sup.last_name),
    dwr_emp.begining_day,
    emp."id",
    dwr.crew_chief,
    dwr_emp.ending_day,
    dwr_emp."state"
    
    order By begining_day DESC
    ; `;

    let hours_count_query = `
    SELECT 
    SUM(total_hours_worked) AS hours_worked,
    emp.id,
    emp.first_name,
    emp.last_name,
    emp."role"
FROM (
    SELECT 
        ROUND(
            CAST((EXTRACT(EPOCH FROM (dwr.ending_day - dwr.begining_day)) / 3600) AS NUMERIC),
            2
        ) AS total_hours_worked,
        dwr.employee_id
    FROM "DWR_Employees" dwr
    WHERE dwr.employee_id = '${employee_id}'
) AS subquery
INNER JOIN "Employees" emp ON emp.id::VARCHAR = subquery.employee_id::VARCHAR
GROUP BY 
    emp.id,
    emp.first_name,
    emp.last_name,
    emp."role";
      `;

    let hourly_rate_finder = `
      SELECT 
       hourly_rate FROM "H2a_Hourly_Rate"  
       ${whereClause}
        Extract(YEAR from year) = ${year};
      `;

    let query = `${dwr_info_query1} ${hours_count_query} ${hourly_rate_finder}`;

    db.connect();

    let result = await db.query(query);
    let tempDwrTasks = [];
    tempDwrTasks.push(result[0].rows);

    let resp = {
      dwrTasks: tempDwrTasks,
      total_hours: result[1].rows[0],
      hourly_rate: result[2].rows[0],

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
