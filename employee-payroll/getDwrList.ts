import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const supervisor_name: string = req.query.supervisor_name;
    const category: string = req.query.category;
    const beg_date: string = req.query.beginning_date;
    const end_date: string = req.query.ending_date;
    const name: string = req.query.name;

    const employee_id: string = req.query.id;
    let whereClause: string = ` WHERE dwr_emp."is_deleted" = FALSE`;

    if (name) whereClause = ` ${whereClause} AND LOWER("emp.first_name") LIKE LOWER('%${name}%')`;
    if (category) whereClause = ` ${whereClause} AND LOWER("dwr_emp."module"") LIKE LOWER('%${category}%')`;
    if (supervisor_name) whereClause = ` ${whereClause} AND LOWER("sup.first_name") LIKE LOWER('%${supervisor_name}%')`;
    if (beg_date) whereClause = `${whereClause} AND dwr_emp.begining_day > '${beg_date}'::timestamp AND dwr_emp.begining_day < '${end_date}'::timestamp`;



    let dwr_info_query1 = `
    SELECT
	hr.hourly_rate,
	CONCAT ( sup.first_name, ' ', sup.last_name ) AS supervisor,
	dwr_emp.created_at as date,
  dwr_emp."module" as category,
	emp."id",
	emp.first_name,
	emp.last_name,
	emp."role",
	(select SUM (ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_emp.ending_day - dwr_emp.begining_day ) ) / 3600 ) AS NUMERIC ), 2 )) AS hours_worked),
	dwr_emp."state"
	
FROM
	"DWR_Employees" dwr_emp
	INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state"
	INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
	INNER JOIN "Employees" sup ON sup."id" :: VARCHAR = dwr_emp.supervisor_id
	INNER JOIN "DWR" dwr on dwr.employee_id:: VARCHAR  = dwr_emp.employee_id:: VARCHAR 
	
  ${whereClause}

	GROUP BY 
	hr.hourly_rate,
		CONCAT(sup.first_name, ' ', sup.last_name) ,
			dwr_emp.created_at,
				emp."id",
						  dwr.crew_chief,	
              category,
	dwr_emp."state"; `;






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
            CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC),
            2
        ) AS total_hours_worked,
        dwr_emp.employee_id
    FROM "DWR_Employees" dwr_emp
    ${whereClause}

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
      MAX(hourly_rate) AS max_hourly_rate,
      (SELECT hourly_rate FROM "H2a_Hourly_Rate" WHERE state = 'Arizona') AS arizona_rate
    FROM "H2a_Hourly_Rate";
      `;



    let query = `${dwr_info_query1} ${hours_count_query} ${hourly_rate_finder}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      dwrTasks: result[0].rows,
      total_hours: result[1].rows,
      hourly_rate: result[2].rows,
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
