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
    const start_date: string = req.query.beginning_date;
    const end_date: string = req.query.ending_date;
    const name: string = req.query.name;
    const state: string = req.query.state;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 200;
    const sort: string = req.query.sort ? req.query.sort : `hw.employee_name` ;
    const order: string = req.query.order ? req.query.order : `desc`;



    const employee_id: string = req.query.id;
    let whereClause: string = ` WHERE dwr_emp."is_deleted" = FALSE`;
    let nameWhereClause: string = '';
    let stateWhereClause :string='';
    let supervisorGroupByClause :string= supervisor_name? `supervisor.first_name,` : '';

    let supervisorWhereClause :string='';
    let supervisorJoinClause : string = '';
    let supervisorWhereClauseHours : string = '';
    let periodRangeClause :string=`pay_periods AS (
        SELECT 
            generate_series(
                '2023-01-01'::date,  
                '2023-12-31'::date,  
                '15 day'::interval   
            ) as start_date,
            generate_series(
                '2023-01-15'::date,  
                '2024-01-15'::date,  
                '15 day'::interval   
            ) as end_date
    )`;

    if (start_date && end_date) nameWhereClause = `WHERE
    dwr_emp.begining_day >= '${start_date}'
    AND dwr_emp.ending_day <= '${end_date}'`;
    if (supervisor_name  ) supervisorWhereClauseHours = ` ${supervisorWhereClauseHours} WHERE LOWER(supervisor.first_name) LIKE LOWER('%${supervisor_name}%')`;


    if (name && start_date && end_date) nameWhereClause = ` ${nameWhereClause} AND LOWER(emp.first_name) LIKE LOWER('%${name}%')`;
    if (name && !(start_date || end_date)) nameWhereClause = ` ${nameWhereClause} WHERE LOWER(emp.first_name) LIKE LOWER('%${name}%')`;


    if (supervisor_name  && !(name && start_date &&  end_date) ) supervisorWhereClause = ` ${supervisorWhereClause} WHERE LOWER(supervisor.first_name) LIKE LOWER('%${supervisor_name}%')`;
    if(supervisor_name) supervisorJoinClause = ` ${supervisorJoinClause}     INNER JOIN "Employees" supervisor ON dwr_emp.supervisor_id = supervisor."id" :: VARCHAR`;
    if (supervisor_name && (name || start_date || end_date) ) supervisorWhereClause = ` AND LOWER(supervisor.first_name) LIKE LOWER('%${supervisor_name}%')`;


    if (state) stateWhereClause = ` ${stateWhereClause} WHERE  LOWER(state) LIKE LOWER('%${state}%')`;
    if (category) whereClause = ` ${whereClause} AND LOWER(dwr_emp."module") LIKE LOWER('%${category}%')`;
    if (supervisor_name) whereClause = ` ${whereClause} AND LOWER(sup.first_name) LIKE LOWER('%${supervisor_name}%')`;
    if (start_date) whereClause = `${whereClause} AND dwr_emp.begining_day > '${start_date}'::timestamp AND dwr_emp.begining_day < '${end_date}'::timestamp`;
    if (state) whereClause = ` ${whereClause} AND LOWER(dwr_emp."state") LIKE LOWER('%${state}%')`;
    if (name) whereClause = ` ${whereClause} AND LOWER(emp.first_name) LIKE LOWER('%${name}%')`;



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
	dwr_emp."state";`;



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
    INNER JOIN "Employees" sup ON sup."id" :: VARCHAR = dwr_emp.supervisor_id
    INNER JOIN "Employees" emp ON emp.id::VARCHAR = dwr_emp.employee_id
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

      let total_hours_dwrs = `SELECT 
      SUM(total_hours_worked) AS total_hours_worked
  FROM (
      SELECT 
          ROUND(
              CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC),
              2
          ) AS total_hours_worked
      FROM "DWR_Employees" dwr_emp
      INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
    INNER JOIN "Employees" sup ON sup."id" :: VARCHAR = dwr_emp.supervisor_id
    ${whereClause}

  
  ) AS subquery;
  `;

  let final_wages_query = `
  
WITH 

hours_worked AS (
    SELECT
        emp."id" AS employee_id,
        CONCAT(emp.first_name, ' ', emp.last_name) AS employee_name,
        SUM(
            ROUND(
                CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC), 2
            )
        ) AS hours_worked
    FROM
        "DWR_Employees" dwr_emp
        INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
        ${supervisorJoinClause}
        ${nameWhereClause}
        ${supervisorWhereClause} 

    GROUP BY
        emp."id",
        emp.first_name,
        ${supervisorGroupByClause}
        emp.last_name
),
emp_state_hours AS (
    SELECT
        emp."id" AS employee_id,
        dwr_emp."state",
        SUM(
            ROUND(CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC), 2)
        ) AS hours_worked,
        SUM(
            ROUND(CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC), 2) *
            (CASE 
                WHEN dwr_emp."state" = 'Arizona' THEN hr.hourly_rate::numeric
                ELSE (SELECT MAX(hourly_rate) FROM "H2a_Hourly_Rate" WHERE "state" != 'Arizona')::numeric
            END)
        ) AS wage
    FROM
        "DWR_Employees" dwr_emp
        INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
        INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state"
        ${supervisorJoinClause}
        ${supervisorWhereClauseHours} 

    GROUP BY
        emp."id",
        dwr_emp."state"
),
state_summary AS (
    SELECT
        employee_id,
        json_agg(
            json_build_object(
                'state', "state",
                'state_hours', hours_worked,
                'state_wage', wage
            ) ORDER BY "state"
        )::text AS state_details,
        SUM(hours_worked) AS total_hours,
        SUM(wage) AS total_wages
    FROM
        emp_state_hours
        ${stateWhereClause}
    GROUP BY
        employee_id
),
hourly_rates AS (
    SELECT
        emp."id" AS employee_id,
        array_agg(DISTINCT (CASE 
                WHEN dwr_emp."state" = 'Arizona' THEN hr.hourly_rate::numeric
                ELSE (SELECT MAX(hourly_rate) FROM "H2a_Hourly_Rate" WHERE "state" != 'Arizona')::numeric
            END)) AS hourly_rates
    FROM
        "DWR_Employees" dwr_emp
        INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
        INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state"
    GROUP BY
        emp."id"
),
supervisors AS (
    SELECT 
        emp."id" AS employee_id,
        array_agg(DISTINCT CONCAT(supervisor.first_name, ' ', supervisor.last_name)) AS supervisor_names
    FROM 
        "Employees" emp
        INNER JOIN "DWR_Employees" dwr_emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
        INNER JOIN "Employees" supervisor ON dwr_emp.supervisor_id = supervisor."id" :: VARCHAR
        ${supervisorWhereClauseHours} 

    GROUP BY 
        emp."id"
)
SELECT 
    json_build_object(
        'employee_id', hw.employee_id,
        'employee_name', hw.employee_name,
        'state_details', ss.state_details::json,
        'total_hours', ss.total_hours,
        'total_wages', ss.total_wages,
        'hourly_rates', hr.hourly_rates,
        'supervisors', sp.supervisor_names
    ) AS result
FROM 
    hours_worked hw
LEFT JOIN 
    state_summary ss ON hw.employee_id = ss.employee_id
LEFT JOIN
    hourly_rates hr ON hw.employee_id = hr.employee_id
LEFT JOIN 
    supervisors sp ON hw.employee_id = sp.employee_id
GROUP BY
    hw.employee_id,
    hw.employee_name,
    ss.state_details,
    ss.total_hours,
    ss.total_wages,
    hr.hourly_rates,
    sp.supervisor_names

		ORDER BY
        ${sort} ${order}    
        
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit}
							;

  `;
  let top_ten_wages =
  `WITH 
  pay_periods AS (
      SELECT 
          generate_series(
              '2023-01-01'::date,  
              '2023-12-31'::date,  
              '15 day'::interval   
          ) as start_date,
          generate_series(
              '2023-01-15'::date,  
              '2024-01-15'::date,  
              '15 day'::interval   
          ) as end_date
  ),
  hours_worked AS (
      SELECT
          emp."id" AS employee_id,
          CONCAT(emp.first_name, ' ', emp.last_name) AS employee_name,
          pp.start_date,
          pp.end_date,
          SUM(
              ROUND(
                  CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC), 2
              )
          ) AS hours_worked
      FROM
          "DWR_Employees" dwr_emp
          INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
          CROSS JOIN pay_periods pp
      WHERE
          dwr_emp.begining_day >= pp.start_date
          AND dwr_emp.ending_day <= pp.end_date
      GROUP BY
          emp."id",
          emp.first_name,
          emp.last_name,
          pp.start_date,
          pp.end_date
  ),
  emp_state_hours AS (
      SELECT
          emp."id" AS employee_id,
          dwr_emp."state",
          SUM(
              ROUND(CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC), 2)
          ) AS hours_worked,
          SUM(
              ROUND(CAST((EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600) AS NUMERIC), 2) *
              (CASE 
                  WHEN dwr_emp."state" = 'Arizona' THEN hr.hourly_rate::numeric
                  ELSE (SELECT MAX(hourly_rate) FROM "H2a_Hourly_Rate" WHERE "state" != 'Arizona')::numeric
              END)
          ) AS wage
      FROM
          "DWR_Employees" dwr_emp
          INNER JOIN "Employees" emp ON emp."id" :: VARCHAR = dwr_emp.employee_id
          INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state"
      GROUP BY
          emp."id",
          dwr_emp."state"
  ),
  state_summary AS (
      SELECT
          employee_id,
          SUM(hours_worked) AS total_hours,
          SUM(wage) AS total_wages
      FROM
          emp_state_hours
      GROUP BY
          employee_id
  )
  SELECT 
      hw.employee_name AS employee_name,
      ss.total_wages AS wages,
      ss.total_hours AS hours_worked
  FROM 
      hours_worked hw
  LEFT JOIN 
      state_summary ss ON hw.employee_id = ss.employee_id
  GROUP BY
      hw.employee_id,
      hw.employee_name,
      ss.total_hours,
      ss.total_wages
  ORDER BY
      ss.total_wages DESC
  LIMIT 10;`
;

    let query = `${dwr_info_query1} ${hours_count_query} ${hourly_rate_finder} ${total_hours_dwrs} ${final_wages_query} ${top_ten_wages}`;
    const filePath = 'query_test.txt';
    try {
        await fs.promises.writeFile(filePath, query);
        context.log(`Data written to file`);
    }
    catch (err) {
        context.log.error(`Error writing data to file: ${err}`);
    }
    db.connect();

    let result = await db.query(query);
    // console.log(result);

    let resp = {
      dwrTasks: result[0].rows,
      total_hours: result[1].rows,
      hourly_rate: result[2].rows,
      total_hours_sum: result[3].rows,
      final_wages: result[4].rows,
      top_ten_wages: result[5].rows,
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
