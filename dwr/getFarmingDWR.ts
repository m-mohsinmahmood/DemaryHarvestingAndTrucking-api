
export function GetFarmingDwr(employee_id: any, startDate: string, endDate: string, dateType: any, month: any, year: any, operation, status: any) {

    let getDwr = ``;
    let where = ``;
    let employeeWhereClause = ``;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr_employees.begining_day) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr_employees.begining_day) = '${year}'`
    }
    else {
        where = `${where} AND dwr_employees.begining_day > '${startDate}'::timestamp AND dwr_employees.begining_day < '${endDate}'::timestamp`
    }

    if (status !== 'all') {
        where = `${where} AND dwr_employees.dwr_status = '${status}'`;
    }
    else
        where = `${where}`;

    if (employee_id !== '' || employee_id !== null)
        employeeWhereClause = `${employeeWhereClause} AND dwr_employees.employee_id = '${employee_id}'`;

    if (operation === 'getDWRToVerify') {
        getDwr = `
        SELECT
        Distinct(dwr_employees.employee_id),
        concat(employees.first_name, ' ', employees.last_name) AS employee_name,
        SUM (
            ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
        ) AS total_hours ,
        dwr_employees."module" AS module,
        dwr_employees.begining_day :: DATE,
		dwr_employees.supervisor_id as last_supervisor_id

        FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Farming_Work_Order" mr ON mr."id" = dwr.work_order_id 
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
        dwr_employees.supervisor_id
        
        ORDER BY
        begining_day DESC
    ;`;
    }

    else if (operation === 'getDWRDetails') {
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
        'ticket_id', fwo.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', fwo."state",
        'supervisor_id', fwo."dispatcher_id",
        'supervisor_name', concat(dispatcher.first_name, ' ', dispatcher.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Farming_Work_Order" fwo ON dwr.work_order_id = fwo."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" dispatcher ON fwo.dispatcher_id = dispatcher."id" 

        WHERE dwr_employees.employee_id = '${employee_id}'
        ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id

        ORDER BY dwr_employees.ending_day DESC
        ;`;
    }

    else if (operation === 'getDWRList') {
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
        'ticket_id', fwo.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', fwo."state",
        'supervisor_id', fwo."dispatcher_id",
        'supervisor_name', concat(dispatcher.first_name, ' ', dispatcher.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Farming_Work_Order" fwo ON dwr.work_order_id = fwo."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" dispatcher ON fwo.dispatcher_id = dispatcher."id" 
        
        WHERE dwr_employees.employee_id = '${employee_id}'
        ${where}
        AND dwr_employees.is_active = FALSE

        GROUP BY dwr_employees.id

        ORDER BY dwr_employees.ending_day DESC
        ;`;
    }

    return getDwr;
}