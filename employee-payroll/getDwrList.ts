import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const supervisor_name: string = req.query.supervisor_name;
        const supervisor_id: string = req.query.supervisor_id;
        const employee_wages_id: string = req.query.employee_id;
        const category: string = req.query.category;
        const start_date: string = req.query.beginning_date;
        const end_date: string = req.query.ending_date;
        const status: string = req.query.status ? req.query.status : '';
        const state: string = req.query.state;
        const name: string = req.query.name;
        const page: number = +req.query.page ? +req.query.page : 0;
        const limit: number = +req.query.limit ? +req.query.limit : 20;
        const order: string = req.query.order ? req.query.order : `desc`;
        const sort: string = req.query.sort ? req.query.sort : `dwr_emp.created_at`;

        let whereClause: string = ` WHERE dwr_emp."is_deleted" = FALSE`;
        let singleWhereClause: string = ` WHERE dwr_emp."is_deleted" = FALSE`;
        let nameWhereClause: string = '';
        let stateWhereClause: string = '';
        let supervisorWhereClause: string = '';
        let statusClause1: string = '';
        let statusClause2: string = '';
        let supervisorWhereClauseHours: string = '';
        let periodRangeClause: string = `pay_periods AS (
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
    dwr_emp.begining_day > '${start_date}'
    AND dwr_emp.begining_day < '${end_date}'`;

        if (status == 'verified') {
            if (status && !(employee_wages_id || start_date || end_date)) statusClause1 = ` ${statusClause1} WHERE dwr_emp.dwr_status = '${status}'`;
            if (status && (employee_wages_id || start_date || end_date)) statusClause1 = ` ${statusClause1} AND dwr_emp.dwr_status = '${status}'`;

        } else if (status == 'unverified') {
            if (status && !(employee_wages_id || start_date || end_date)) statusClause1 = ` ${statusClause1} WHERE dwr_emp.dwr_status = 'pendingVerification'`;
            if (status && (employee_wages_id || start_date || end_date)) statusClause1 = ` ${statusClause1} AND dwr_emp.dwr_status = 'pendingVerification'`;
        }


        if (status == 'verified') {
            if (status && !(supervisor_id)) statusClause2 = ` ${statusClause2} WHERE dwr_emp.dwr_status = '${status}'`;
            if (status && (supervisor_id)) statusClause2 = ` ${statusClause2} AND dwr_emp.dwr_status = '${status}'`;

        } else if (status == 'unverified') {
            if (status && !(supervisor_id)) statusClause2 = ` ${statusClause2} WHERE dwr_emp.dwr_status = 'pendingVerification'`;
            if (status && (supervisor_id)) statusClause2 = ` ${statusClause2} AND dwr_emp.dwr_status = 'pendingVerification'`;
        }



        if (employee_wages_id && (start_date || end_date || status)) nameWhereClause = ` ${nameWhereClause} AND dwr_emp.employee_id = '${employee_wages_id}'`;
        if (employee_wages_id && !(start_date || end_date || status)) nameWhereClause = ` ${nameWhereClause} WHERE dwr_emp.employee_id = '${employee_wages_id}'`;

        if (supervisor_id) supervisorWhereClauseHours = ` ${supervisorWhereClauseHours} WHERE dwr_emp.supervisor_id = '${supervisor_id}'`;
        if (supervisor_id && !(employee_wages_id && start_date && end_date)) supervisorWhereClause = ` ${supervisorWhereClause} WHERE dwr_emp.supervisor_id = '${supervisor_id}'`;
        // if(supervisor_id) supervisorJoinClause = ` ${supervisorJoinClause}     INNER JOIN "Employees" supervisor ON dwr_emp.supervisor_id = supervisor."id" :: VARCHAR`;
        if (supervisor_id && (employee_wages_id || start_date || end_date)) supervisorWhereClause = ` AND dwr_emp.supervisor_id = '${supervisor_id}'`;


        if (state) stateWhereClause = ` ${stateWhereClause} WHERE  LOWER(state) LIKE LOWER('%${state}%')`;
        if (category) whereClause = ` ${whereClause} AND LOWER(dwr_emp."module") LIKE LOWER('%${category}%')`;
        if (supervisor_name) whereClause = ` ${whereClause} AND LOWER(sup.first_name) LIKE LOWER('%${supervisor_name}%')`;
        if (start_date) whereClause = `${whereClause} AND dwr_emp.begining_day > '${start_date}'::timestamp AND dwr_emp.begining_day < '${end_date}'::timestamp`;
        if (state) whereClause = ` ${whereClause} AND LOWER(dwr_emp."state") LIKE LOWER('%${state}%')`;
        if (name) whereClause = ` ${whereClause} AND LOWER(emp.first_name) LIKE LOWER('%${name}%')`;

        //New filters for all DWRs individual

        if (state) singleWhereClause = ` ${singleWhereClause} AND  LOWER(dwr_emp."state") LIKE LOWER('%${state}%')`;
        if (category) singleWhereClause = ` ${singleWhereClause} AND LOWER(dwr_emp."module") LIKE LOWER('%${category}%')`;
        if (supervisor_id) singleWhereClause = ` ${singleWhereClause} AND dwr_emp.supervisor_id = '${supervisor_id}'`;
        if (employee_wages_id) singleWhereClause = ` ${singleWhereClause} AND dwr_emp.employee_id = '${employee_wages_id}'`;
        if (status == 'verified') singleWhereClause = ` ${singleWhereClause} AND dwr_emp.dwr_status = '${status}'`;
        if (status == 'unverified') singleWhereClause = ` ${singleWhereClause} AND dwr_emp.dwr_status = 'pendingVerification'`;
        if (start_date && end_date) singleWhereClause = `${singleWhereClause} AND dwr_emp.begining_day > '${start_date}'::timestamp AND dwr_emp.begining_day < '${end_date}'::timestamp`;

        let dwr_info_query1 = `
    SELECT DISTINCT
    CASE WHEN dwr_emp."state" = 'Arizona' THEN hr.hourly_rate::numeric
         ELSE (SELECT MAX(hourly_rate) FROM "H2a_Hourly_Rate")::numeric
    END AS hourly_rate,
    CONCAT(sup.first_name, ' ', sup.last_name) AS supervisor,
    dwr_emp."module" AS category,
    emp."id",
    emp.first_name,
    emp.last_name,
    emp."role",
    CAST(EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600 AS NUMERIC(10, 2)) AS hours_worked,
    dwr_emp."state",
    CAST(EXTRACT(EPOCH FROM (dwr_emp.ending_day - dwr_emp.begining_day)) / 3600 AS NUMERIC(10, 2)) * CASE WHEN dwr_emp."state" = 'Arizona' THEN hr.hourly_rate::numeric
         ELSE (SELECT MAX(hourly_rate) FROM "H2a_Hourly_Rate")::numeric
    END AS wage,
    dwr_emp.begining_day,
    dwr_emp.ending_day,
    dwr_emp.created_at,
    dwr_emp.dwr_status,
    dwr_emp.id as ticket_id,
    dwr_emp.employee_notes,
    dwr_emp.employee_id AS employeeId,
    dwr_emp.supervisor_id AS supervisorId
    
    FROM

    "Bridge_DailyTasks_DWR" bridge
    INNER JOIN "DWR_Employees" dwr_emp ON dwr_emp."id" = bridge.dwr_id 
    INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
    INNER JOIN "H2a_Hourly_Rate" hr ON hr."state" = dwr_emp."state"
    INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_emp.employee_id
    INNER JOIN "Employees" sup ON sup."id"::VARCHAR = dwr_emp.supervisor_id

    ${singleWhereClause}

    ORDER BY
    ${sort} ${order}    
    
    LIMIT 
    ${limit}
    
    OFFSET ${page};
    `;



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

        let query = `${dwr_info_query1} ${hours_count_query} ${hourly_rate_finder} ${total_hours_dwrs} ${top_ten_wages}`;

        db.connect();
   
        let result = await db.query(query);

        let resp = {
            dwrTasks: result[0].rows,
            total_hours: result[1].rows,
            hourly_rate: result[2].rows,
            total_hours_sum: result[3].rows,
            top_ten_wages: result[4].rows,
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
