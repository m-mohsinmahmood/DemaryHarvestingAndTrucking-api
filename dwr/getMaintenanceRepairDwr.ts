
export function GetMaintenanceRepairDwr(employee_id: any, date: any, dateType: any, month: any, year: any, operation, status: any) {

    let getDwr = ``;

    let where = ``;
    let whereSubQuery = ``;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr_employees.begining_day) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr_employees.begining_day) = '${year}'`
    }
    else {
        where = `${where} AND CAST(dwr_employees.begining_day AS Date) = '${date}'`
    }

    if (dateType === 'month') {
        whereSubQuery = `${whereSubQuery} AND EXTRACT(MONTH FROM begining_day) = '${month}'`
        whereSubQuery = `${whereSubQuery} AND EXTRACT(YEAR FROM begining_day) = '${year}'`
    }
    else {
        whereSubQuery = `${whereSubQuery} AND CAST(begining_day AS Date) = '${date}'`
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
        dwr_employees.begining_day :: DATE,
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
        INNER JOIN "Maintenance_Repair" mr ON mr."id" = dwr.main_repair_ticket_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        AND dwr."taskType" = 'work done'
        AND dwr_employees.supervisor_id != 'null'

        ${where}
       
        GROUP BY
        dwr_employees.employee_id,
        dwr_employees.begining_day :: DATE,
        concat(employees.first_name, ' ', employees.last_name),
        dwr_employees."module",
        dwr_employees.supervisor_id

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
        dwr_employees."supervisor_notes",
        dwr_employees."employee_notes",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', mr.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', mr."state",
        'supervisor_id', mr."assignedById",
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON dwr.main_repair_ticket_id = mr."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON mr."assignedById" = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
        AND dwr."taskType" = 'work done'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.ending_day DESC
        ;        `;
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
        'ticket_id', mr.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', mr."state",
        'supervisor_id', mr."assignedById",
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON dwr.main_repair_ticket_id = mr."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON mr."assignedById" = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
        AND dwr."taskType" = 'work done'
        ${where}
        AND dwr_employees.is_active = FALSE

        GROUP BY dwr_employees.id

        ORDER BY dwr_employees.ending_day DESC
                ;`;
    }
    
    return getDwr;
}