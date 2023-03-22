
export function GetFarmingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation, taskId: any, module: any) {

    let getDwr = ``;

    let where = ``;

    if (role === 'supervisor') {
        where = `${where} AND fwo.dispatcher_id = '${employee_id}'`;
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
        Distinct dwr_employees."id" as dwr_id,
        dwr.dwr_type,
        dwr_employees.created_at
    
        from 
    
        "Bridge_DailyTasks_DWR" bridge 
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
        INNER JOIN "DWR" dwr ON bridge .task_id = dwr."id"
        INNER JOIN "Farming_Work_Order" fwo ON dwr.work_order_id = fwo.id

        WHERE 
        dwr.is_day_closed= TRUE
        ${where}

    ;`;
    }

    else if (operation === 'getTasks' && module === 'farming') {
        getDwr = `
        select bridge.dwr_id,bridge.task_id, dwr.dwr_type,dwr.status,dwr.notes from 
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id" AND bridge.dwr_id = '${taskId}'
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        WHERE (dwr.status IS NULL OR dwr.status = 'reassigned' OR dwr.status = '')
        ;`
    }

    else if (operation === 'getTicketData' && module === 'farming') {
        getDwr = `
        select * from
        "DWR" dwr 
        INNER JOIN "Farming_Work_Order" fwo ON dwr."work_order_id" = fwo."id" AND dwr.id = '${taskId}';
        `
    }

    return getDwr;
}