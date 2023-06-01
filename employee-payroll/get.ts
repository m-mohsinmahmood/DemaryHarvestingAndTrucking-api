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
	INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state"
	INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
	INNER JOIN "Employees" sup ON sup."id" :: VARCHAR = dwr_emp.supervisor_id
	INNER JOIN "DWR" dwr on dwr.employee_id:: VARCHAR  = dwr_emp.employee_id:: VARCHAR 
	
  WHERE
	dwr.employee_id = '${employee_id}' 
	AND dwr.created_at >= now( ) - INTERVAL '14 DAYS'

	GROUP BY 
	hr.hourly_rate,
		CONCAT(sup.first_name, ' ', sup.last_name) ,
			dwr_emp.created_at,
				emp."id",
						  dwr.crew_chief,	
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
      MAX(hourly_rate) AS max_hourly_rate,
      (SELECT hourly_rate FROM "H2a_Hourly_Rate" WHERE state = 'Arizona') AS arizona_rate
    FROM "H2a_Hourly_Rate";
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
