
export function GetFarmingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation, taskId: any, module: any, type: any) {

    let getDwr = ``;

    let where = ``;

    // if (type === 'getAssignedDWR') {
    //     where = `${where} AND fwo.dispatcher_id = '${employee_id}'`;
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
            mr."dispatcher_id" AS assigned_by_id,
        concat(dispatcher.first_name, ' ', dispatcher.last_name) AS supervisor_name,
        dwr_employees."module" AS module,
        dwr_employees.created_at :: DATE
        
        FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Farming_Work_Order" mr ON mr."id" = dwr.work_order_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 
        INNER JOIN "Employees" dispatcher ON mr.dispatcher_id::VARCHAR = dispatcher.ID :: VARCHAR 
        
        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
        AND dwr_employees.dwr_verified = FALSE
        AND mr.dispatcher_id = (
        select mr.dispatcher_id 
    
            FROM
            "Bridge_DailyTasks_DWR" bridge
            INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
            INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
            INNER JOIN "Farming_Work_Order" mr ON mr."id" = dwr.work_order_id 
    
            where  
            dwr_employees.is_active = FALSE
            ORDER BY mr.created_at DESC LIMIT 1
            )
        
            GROUP BY
            dwr_employees.employee_id,
            dwr_employees.created_at :: DATE,
            concat(employees.first_name, ' ', employees.last_name),
            concat(dispatcher.first_name, ' ', dispatcher.last_name),
            dwr_employees."module",
            mr.dispatcher_id
        
        ORDER BY
            created_at DESC
    ;`;
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