
export function GetMaintenanceRepairDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation, taskId: any, module: any, type: any) {

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
            mr."assignedById" AS assigned_by_id,
        concat(dispatcher.first_name, ' ', dispatcher.last_name) AS supervisor_name,
        dwr_employees."module" AS module,
        dwr_employees.created_at :: DATE
        
    FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Maintenance_Repair" mr ON mr."id" = dwr.main_repair_ticket_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 
        INNER JOIN "Employees" dispatcher ON mr."assignedById"::VARCHAR = dispatcher.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
        AND dwr_employees.dwr_verified = FALSE
        AND mr."assignedById" = (select mr."assignedById" 
    
            FROM
            "Bridge_DailyTasks_DWR" bridge
            INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
            INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
            INNER JOIN "Maintenance_Repair" mr ON mr."id" = dwr.main_repair_ticket_id 
    
            where  
            dwr_employees.is_active = FALSE
            AND dwr."taskType" = 'work done' 
            ORDER BY mr.createdat DESC LIMIT 1
            )
        
            GROUP BY
            dwr_employees.employee_id,
            dwr_employees.created_at :: DATE,
            concat(employees.first_name, ' ', employees.last_name),
            concat(dispatcher.first_name, ' ', dispatcher.last_name),
            mr."assignedById",
            dwr_employees."module"
        
        ORDER BY
            created_at DESC;
       
        `;
    }

    if (operation === 'getDWR') {
        getDwr = `
        select 
        DISTINCT dwr_employees."id" as dwr_id,
        dwr.dwr_type,
        concat(e.first_name, ' ', e.last_name) as employee_name,
        dwr_employees.created_at
        
        from 
        
        "Bridge_DailyTasks_DWR" bridge 
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON mr."id" = dwr.main_repair_ticket_id 
        INNER JOIN "Employees" e ON CAST(e."id" as VARCHAR) = dwr_employees.employee_id 
    
        WHERE 
        dwr.is_day_closed= TRUE
        ${where}

    ;`;
    }

    else if (operation === 'getTasks' && module === 'maintenance-repair' && type === 'getMyDWR') {
        getDwr = `
        select bridge.dwr_id,bridge.task_id, dwr.dwr_type,dwr.status,dwr.notes, dwr."taskType" from 
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id" AND bridge.dwr_id = '${taskId}'
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        WHERE (dwr.status IS NULL OR dwr.status = 'reassigned' OR dwr.status = '')
        ;`
    }
    else if (operation === 'getTasks' && module === 'maintenance-repair' && type === 'getAssignedDWR') {
        getDwr = `
        select bridge.dwr_id,bridge.task_id, dwr.dwr_type,dwr.status,dwr.notes,dwr."taskType" from 
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id" AND bridge.dwr_id = '${taskId}'
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON  dwr.main_repair_ticket_id = mr."id"
        WHERE (dwr.status IS NULL OR dwr.status = 'reassigned' OR dwr.status = '')
        AND mr."assignedById" = '${employee_id}'
        AND mr."iscompleted" = TRUE
        ;`
    }

    else if (operation === 'getTicketData' && module === 'maintenance-repair') {
        getDwr = `
        select 
        mr."id",
        concat(sup.first_name, ' ', sup.last_name) as supervisor_name,
        sup."id" as supervisor_id,
        concat(mech.first_name, ' ', mech.last_name) as mechanic_name,
        mech."id" as mechanic_id,
        mr.city,
        mr."state",
        mr."issueCategory",
        mr."severityType",
        mr.status,
        mr.description,
        mr.summary,
        mv."id" as machinery_id,
        mv."name" as machinery_name
        
        from
        "DWR" dwr 
        INNER JOIN "Maintenance_Repair" mr ON dwr.main_repair_ticket_id = mr."id" AND dwr.id = '${taskId}'
        INNER JOIN "Employees" sup ON sup."id" = mr."assignedById"
        INNER JOIN "Employees" mech ON mech."id" = mr."assignedToId"
        INNER JOIN "Machinery" mv ON mv."id" = mr."equipmentId"
        ;
        `
    }

    return getDwr;
}