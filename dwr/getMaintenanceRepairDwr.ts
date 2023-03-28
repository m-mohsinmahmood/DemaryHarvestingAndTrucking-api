
export function GetMaintenanceRepairDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation, taskId: any, module: any, type: any) {

    let getDwr = ``;

    let where = ``;

    if (type === 'getAssignedDWR') {
        where = `${where} AND mr."assignedById" = '${employee_id}'`;
        where = `${where} AND mr."iscompleted" = 'TRUE'`;
    }
    else
        where = `${where} AND dwr.employee_id = '${employee_id}'`;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr_employees.created_at) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr_employees.created_at) = '${year}'`
    }
    else {
        where = `${where} AND CAST(dwr_employees.created_at AS Date) = '${date}'`
    }

    if (operation === 'getDWR') {
        getDwr = `
        select 
        DISTINCT dwr_employees."id" as dwr_id,
        dwr.dwr_type,
        dwr_employees.created_at
        
        from 
        
        "Bridge_DailyTasks_DWR" bridge 
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Maintenance_Repair" mr ON mr."id" = dwr.main_repair_ticket_id 
    
        WHERE 
        dwr.is_day_closed= TRUE
        ${where}

    ;`;
    }

    else if (operation === 'getTasks' && module === 'maintenance-repair') {
        getDwr = `
        select bridge.dwr_id,bridge.task_id, dwr.dwr_type,dwr.status,dwr.notes from 
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id" AND bridge.dwr_id = '${taskId}'
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        WHERE (dwr.status IS NULL OR dwr.status = 'reassigned' OR dwr.status = '')
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