import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const to: string = req.query.to;
  const from: string = req.query.from;

  let year = req.query.year;
  let state = req.query.state;

  let whereClause = `Where`;
  if (state) whereClause = ` ${whereClause}LOWER("state") LIKE LOWER('%${state}%') AND`;
  else
    whereClause = ` ${whereClause} state = 'Arizona' AND`;

  if (!year)
    year = `(SELECT EXTRACT(YEAR from now()))`

  let dateRangeFrom = `''`;
  let dateRangeTo = `now()`;

  if (from != '' && from != undefined) {
    dateRangeFrom = ` '${from}'`;
  }

  if (to != '' && to != undefined) {
    dateRangeTo = ` '${to}' `;
  }

  try {
    const employee_id: string = req.query.id;

    let dwr_detailed_query = `
    SELECT DISTINCT
        CONCAT ( sup.first_name, ' ', sup.last_name ) AS supervisor,
        emp."id",
        emp.first_name,
        emp.last_name,
        emp."role",
        CAST ( EXTRACT ( EPOCH FROM ( dwr_emp.ending_day - dwr_emp.begining_day ) ) / 3600 AS NUMERIC ( 10, 2 ) ) AS hours_worked,
        dwr_emp."state",
        dwr_emp.begining_day,
        dwr_emp.dwr_status,
        dwr_emp.ID AS ticket_id,
        dwr_emp.created_at

    FROM
        "DWR_Employees" dwr_emp
        INNER JOIN "DWR" dwr ON dwr.employee_id :: VARCHAR = dwr_emp.employee_id :: VARCHAR 
        INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
        INNER JOIN "Employees" sup ON sup."id" :: VARCHAR = dwr_emp.supervisor_id
        
    WHERE
        dwr_emp.employee_id = '${employee_id}' 
        AND dwr_emp.begining_day :: timestamp > '${from}' :: timestamp 
        AND dwr_emp.begining_day :: timestamp < '${to}' :: timestamp 
        AND dwr_emp.supervisor_id != 'null'
    ORDER BY
    dwr_emp.begining_day DESC; `;


  let dwr_info_query1 = `
  SELECT
	hr.hourly_rate,
	CONCAT ( sup.first_name, ' ', sup.last_name ) AS supervisor,
	dwr_emp.created_at as date,
	emp."id",
	emp.first_name,
	emp.last_name,
	emp."role",
	(select SUM (ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_emp.ending_day - dwr_emp.begining_day ) ) / 3600 ) AS NUMERIC ), 2 )) AS hours_worked),
	dwr_emp."state"
	
FROM
	"DWR_Employees" dwr_emp
	INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state" AND Extract(YEAR from hr.year) = ${year} 
	INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
	INNER JOIN "Employees" sup ON sup."id" :: VARCHAR = dwr_emp.supervisor_id
	INNER JOIN "DWR" dwr on dwr.employee_id:: VARCHAR  = dwr_emp.employee_id:: VARCHAR 
	
  WHERE
	dwr_emp.employee_id = '${employee_id}' 
  AND dwr_emp.created_at :: DATE >= '${from}' :: DATE
  AND dwr_emp.created_at :: DATE <= '${to}' :: DATE

	GROUP BY 
	hr.hourly_rate,
		CONCAT(sup.first_name, ' ', sup.last_name) ,
			dwr_emp.created_at,
				emp."id",
						  dwr.crew_chief,	
	dwr_emp."state"; `;

    let dwr_info_query2 = `
SELECT
    hr.hourly_rate,
    fwo.STATE AS STATE,
    dwr.created_at AS DATE,
    dwr.hours_worked,
    CONCAT(disp.first_name, ' ', disp.last_name) as supervisor
    
  FROM
    "DWR" dwr
    INNER JOIN "Farming_Work_Order" fwo ON dwr.work_order_id = fwo."id"
    INNER JOIN "H2a_Hourly_Rate" hr ON fwo."state" = hr."state" AND Extract(YEAR from hr.year) = ${year} 
    INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
    INNER JOIN "Employees" disp ON fwo.dispatcher_id = disp."id"
  WHERE dwr.employee_id = '${employee_id}' 
	AND fwo.created_at :: DATE >= '${from}' :: DATE
  AND fwo.created_at :: DATE <= '${to}' :: DATE; `;


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
	INNER JOIN "H2a_Hourly_Rate" hr ON cjs."state" = hr."state" AND Extract(YEAR from hr.year) = ${year} 
	INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
	INNER JOIN "Employees" crew ON cjs.crew_chief_id = emp."id"
WHERE
  dwr.employee_id = '${employee_id}' 
	AND dwr.created_at :: DATE >= '${from}' :: DATE
  AND dwr.created_at :: DATE <= '${to}' :: DATE; `;

    let hourly_rate_finder = `
    SELECT 
    hourly_rate FROM "H2a_Hourly_Rate"  
    ${whereClause}
     Extract(YEAR from year) = ${year};
      `;


    let query = ` ${dwr_info_query1} ${dwr_info_query2} ${dwr_info_query3} ${dwr_detailed_query} ${hourly_rate_finder}`;

    db.connect();


    let result = await db.query(query);
    let tempDwrTasks = [];
    tempDwrTasks.push(result[0].rows);
    tempDwrTasks.push(result[1].rows);
    tempDwrTasks.push(result[2].rows);

    let resp = {
      dwrTasks: tempDwrTasks,
      dwrsDetailed: result[3].rows,
      hourly_rates: result[4].rows
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
