
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
        select 
        fwo."id" as id, 
        customers.customer_name,
        concat(dispatcher.first_name, ' ', dispatcher.last_name) as dispatcher_name,
        concat(tractorD.first_name, ' ', tractorD.last_name) as tractor_driver_name,
        farm."name" as farm,
        field."name" as field,
        dwr.hours_worked,
        dwr.notes
        
        from
        "DWR" dwr 
        INNER JOIN "Farming_Work_Order" fwo ON dwr."work_order_id" = fwo."id" AND dwr.id = '${taskId}'
        INNER JOIN "Customers" customers ON customers."id" = fwo.customer_id
		INNER JOIN "Employees" dispatcher ON dispatcher."id" = fwo.dispatcher_id
		INNER JOIN "Employees" tractorD ON tractorD."id" = fwo.tractor_driver_id
		INNER JOIN "Customer_Farm" farm ON farm."id" = fwo.farm_id
		INNER JOIN "Customer_Field" field ON field."id" = fwo.field_id
        ;
        `
    }

    return getDwr;
}