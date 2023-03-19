
export function GetTrainingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation, taskId: any) {

    let getDwr = ``;

    let where = ``;

    if (role === 'supervisor')
        where = `${where} AND training.trainer_id = '${employee_id}'`;
    else
        where = `${where} AND dwr.employee_id = '${employee_id}'`;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr.created_at) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr.created_at) = '${year}'`
    }
    else {
        where = `${where} AND CAST(created_at AS Date) = '${date}'`
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
    INNER JOIN "Training" training ON dwr.training_record_id = training."id"

    WHERE 
    dwr.is_day_closed= TRUE
    ${where}
    ;`;
    }

    else if (operation === 'getTasks') {
        getDwr = `
        select bridge.dwr_id,bridge.task_id, dwr.dwr_type from 
    "Bridge_DailyTasks_DWR" bridge
    INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id" AND bridge.dwr_id = '${taskId}'
    INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        ;`
    }

    else if (operation === 'getTicketData') {
        getDwr = `
        select * from
        "DWR" dwr 
        INNER JOIN "Training" training ON dwr."training_record_id" = training."id" AND dwr.id = '${taskId}';
        
        select * from
        "DWR" dwr 
        INNER JOIN "Trainee" trainee ON dwr.trainee_record_id = trainee."id" AND dwr.id = '${taskId}';
        
        `
    }

    return getDwr;
}