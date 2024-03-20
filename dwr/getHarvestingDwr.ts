
export function GetHarvestingDwr(employee_id: any, startDate: string, endDate: string, dateType: any, month: any, year: any, operation, status: any, role: any) {

    let getDwr = ``;
    let where = ``;
    let employeeWhereClause = ``;
    let whereSubQuery = ``;

    if (dateType === 'month') {
        where = `${where} AND dwr_employees.begining_day > '${startDate}'::timestamp AND dwr_employees.begining_day < '${endDate}'::timestamp`
        whereSubQuery = `${whereSubQuery} AND dwr_employees.begining_day > '${startDate}'::timestamp AND dwr_employees.begining_day < '${endDate}'::timestamp`
    }
    else {
        where = `${where} AND dwr_employees.begining_day > '${startDate}'::timestamp AND dwr_employees.begining_day < '${endDate}'::timestamp`
        whereSubQuery = `${whereSubQuery} AND begining_day > '${startDate}'::timestamp AND begining_day < '${endDate}'::timestamp`
    }

    if (status !== 'all') {
        where = `${where} AND dwr_employees.dwr_status = '${status}'`;
    }
    else
        where = `${where}`;

    if (employee_id !== '' && employee_id !== null)
        employeeWhereClause = `${employeeWhereClause} AND dwr_employees.employee_id = '${employee_id}'`;

    if (operation === 'getDWRToVerify') {
        getDwr = `
        SELECT
        Distinct(dwr_employees.employee_id),
        dwr_employees.id,
        concat(employees.first_name, ' ', employees.last_name) AS employee_name,
        ABS(EXTRACT(EPOCH FROM dwr_employees.ending_day - dwr_employees.begining_day)/3600) as total_hours,
        dwr_employees."module" AS module,
        dwr_employees.begining_day :: DATE,
        dwr_employees.supervisor_id as last_supervisor_id,
        dwr_employees.begining_day AS checkin_time,
        dwr_employees.ending_day AS checkout_time,
        dwr_employees.dwr_notes,
       (SELECT
        supervisor_id as last_supervisor_id

        FROM
        "DWR_Employees"

        WHERE 
        is_active = FALSE
        ${whereSubQuery}
        
        AND employee_id = dwr_employees.employee_id
        AND supervisor_id != 'null'

        ORDER BY begining_day DESC
        LIMIT 1)

        FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Customer_Job_Setup" cjs ON cjs."id" = dwr.job_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
        ${employeeWhereClause}

        GROUP BY
        dwr_employees.employee_id,
        dwr_employees.begining_day :: DATE,
        concat(employees.first_name, ' ', employees.last_name),
        dwr_employees."module",
        dwr_employees.supervisor_id,
        dwr_employees.id,
        ABS(EXTRACT(EPOCH FROM dwr_employees.ending_day - dwr_employees.begining_day)/3600),
        dwr_employees.supervisor_notes,
        dwr_employees.employee_notes,
        dwr_employees.begining_day,
        dwr_employees.ending_day

        ORDER BY
        begining_day DESC;
        `;
    }

    else if (operation === 'getDWRDetails') {

        let supervisor = ``;
        if (role == 'Crew Chief') {
            supervisor = `INNER JOIN "Employees" supervisor ON cjs.director_id::VARCHAR = supervisor."id"::VARCHAR`;
        }
        else {
            supervisor = `INNER JOIN "Employees" supervisor ON cjs.crew_chief_id::VARCHAR = supervisor."id"::VARCHAR`;
        }

        getDwr = `
        select 
        dwr_employees.id,
        dwr_employees.begining_day as login_time,
        dwr_employees.ending_day as logout_time,
        dwr_employees."module",
        dwr_employees."supervisor_notes",
        dwr_employees."employee_notes",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
            'ticket_id', cjs.job_setup_name,
            'employee_id', emp.id,
            'employee_name', concat(emp.first_name, ' ', emp.last_name),
            'state', cjs."state",
            'supervisor_id', cjs.crew_chief_id,
            'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name),
            'beginning_engine_hours', dwr.beginning_engine_hours,
            'ending_engine_hours', dwr.ending_engine_hours,
            'beginning_separator_hours', dwr.beginning_separator_hours,
            'ending_separator_hours', dwr.ending_separator_hours,
            'begining_odometer_miles', dwr.begining_odometer_miles,
            'ending_odometer_miles', dwr.ending_odometer_miles
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Customer_Job_Setup" cjs ON dwr.job_id = cjs."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery.id
        ${supervisor}

        WHERE 
        dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.ending_day DESC
                ;`;
    }

    else if (operation === 'getDWRList') {
        let supervisor = ``;
        if (role == 'Crew Chief') {
            supervisor = `INNER JOIN "Employees" supervisor ON cjs.director_id::VARCHAR = supervisor."id"::VARCHAR`;
        }
        else {
            supervisor = `INNER JOIN "Employees" supervisor ON cjs.crew_chief_id::VARCHAR = supervisor."id"::VARCHAR`;
        }

        getDwr = `
        select 
        dwr_employees.id,
        dwr_employees.begining_day as login_time,
        dwr_employees.ending_day as logout_time,
        dwr_employees."module",
        dwr_employees."supervisor_notes",
        dwr_employees."employee_notes",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', cjs.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', cjs."state",
        'supervisor_id', cjs.crew_chief_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name),
        'beginning_engine_hours', dwr.beginning_engine_hours,
        'ending_engine_hours', dwr.ending_engine_hours,
        'beginning_separator_hours', dwr.beginning_separator_hours,
        'ending_separator_hours', dwr.ending_separator_hours,
        'begining_odometer_miles', dwr.begining_odometer_miles,
        'ending_odometer_miles', dwr.ending_odometer_miles
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Customer_Job_Setup" cjs ON dwr.job_id = cjs."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery.id
       ${supervisor}

        WHERE dwr_employees.employee_id = '${employee_id}'
        ${where}
        AND dwr_employees.is_active = FALSE

        GROUP BY dwr_employees.id

        ORDER BY dwr_employees.ending_day DESC
                ;`;
    }

    return getDwr;
}