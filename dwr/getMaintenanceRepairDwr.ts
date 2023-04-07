
export function GetMaintenanceRepairDwr(employee_id: any, date: any, dateType: any, month: any, year: any, operation, status: any) {

    let getDwr = ``;

    let where = ``;

    // if (type === 'getAssignedDWR') {
    //     where = `${where} AND mr."assignedById" = '${employee_id}'`;
    // }
    // else
    //     where = `${where} AND dwr.employee_id = '${employee_id}'`;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr_employees.created_at) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr_employees.created_at) = '${year}'`
    }
    else {
        where = `${where} AND CAST(dwr_employees.created_at AS Date) = '${date}'`
    }

    if (operation === 'getDWRToVerify') {
        getDwr = `
        SELECT
        Distinct(dwr_employees.employee_id),
        concat(employees.first_name, ' ', employees.last_name) AS employee_name,
        SUM (
            ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.modified_at - dwr_employees.created_at ) ) / 3600 ) AS NUMERIC ), 2 ) 
        ) AS total_hours ,
        dwr_employees."module" AS module,
        dwr_employees.created_at :: DATE
        
    FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Maintenance_Repair" mr ON mr."id" = dwr.main_repair_ticket_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
        AND dwr_employees.dwr_status = 'pendingVerification'
       
        GROUP BY
        dwr_employees.employee_id,
        dwr_employees.created_at :: DATE,
        concat(employees.first_name, ' ', employees.last_name),
        dwr_employees."module"
        
        ORDER BY
            created_at DESC;
        `;
    }

    else if (operation === 'getDWRDetails') {
        getDwr = `
        select 
        dwr_employees.id,
        dwr_employees.created_at as login_time,
        dwr_employees.modified_at as logout_time,
        dwr_employees."module",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.modified_at - dwr_employees.created_at ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', mr.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', mr."state",
        'supervisor_id', mr."assignedById"
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON dwr.main_repair_ticket_id = mr."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        AND dwr_employees.dwr_status = 'pendingVerification'
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.created_at ASC;
        `;
    }

    else if (operation === 'getDWRList') {
        if (status !== 'all') {
            status = `AND dwr_employees.dwr_status = '${status}'`;
        }
        else
            status = ``;

        getDwr = `
        select 
        dwr_employees.id,
        dwr_employees.created_at as login_time,
        dwr_employees.modified_at as logout_time,
        dwr_employees."module",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.modified_at - dwr_employees.created_at ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', mr.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', mr."state",
        'supervisor_id', mr."assignedById"
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON dwr.main_repair_ticket_id = mr."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        
        WHERE dwr_employees.employee_id = '${employee_id}'
        ${where}
        AND dwr_employees.is_active = FALSE
        ${status}

        GROUP BY dwr_employees.id

        ORDER BY dwr_employees.created_at ASC
        ;`;
    }
    
    return getDwr;
}