
export function GetOtherDwr(employee_id: any, date: any, dateType: any, month: any, year: any, operation, status: any) {

    let getDwr = ``;

    let where = ``;

    // if (type === 'getAssignedDWR') {
    //     where = `${where} AND mr."assignedById" = '${employee_id}'`;
    // }
    // else
    //     where = `${where} AND dwr.employee_id = '${employee_id}'`;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr_employees.begining_day) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr_employees.begining_day) = '${year}'`
    }
    else {
        where = `${where} AND CAST(dwr_employees.begining_day AS Date) = '${date}'`
    }

    if (status !== 'all') {
        where = `${where} AND dwr_employees.dwr_status = '${status}'`;
    }
    else
        where = `${where}`;

    if (operation === 'getDWRToVerify') {
        getDwr = `
        SELECT
        Distinct(dwr_employees.employee_id),
        concat(employees.first_name, ' ', employees.last_name) AS employee_name,
        SUM (
            ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
        ) AS total_hours ,
        dwr_employees."module" AS module,
        dwr_employees.begining_day :: DATE
        
    FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Other" ot ON ot."id" = dwr.other_record_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
       
        GROUP BY
        dwr_employees.employee_id,
        dwr_employees.begining_day :: DATE,
        concat(employees.first_name, ' ', employees.last_name),
        dwr_employees."module"
        
        ORDER BY
        begining_day DESC;
        `;
    }

    else if (operation === 'getDWRDetails') {
        getDwr = `
        select 
        dwr_employees.id,
        dwr_employees.begining_day as login_time,
        dwr_employees.ending_day as logout_time,
        dwr_employees."module",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', ot.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', ot."state",
        'supervisor_id', ot.supervisor_id
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Other" ot ON dwr.other_record_id = ot."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.begining_day ASC;
        `;
    }

    else if (operation === 'getDWRList') {
        getDwr = `
        select 
        dwr_employees.id,
        dwr_employees.begining_day as login_time,
        dwr_employees.ending_day as logout_time,
        dwr_employees."module",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', ot.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', ot."state",
        'supervisor_id', ot.supervisor_id
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Other" ot ON dwr.other_record_id = ot."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        
        WHERE dwr_employees.employee_id = '${employee_id}'
        ${where}
        AND dwr_employees.is_active = FALSE

        GROUP BY dwr_employees.id

        ORDER BY dwr_employees.begining_day ASC
        ;`;
    }

    return getDwr;
}