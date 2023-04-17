
export function GetTrainingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, operation, status: any) {

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
        dwr_employees.begining_day :: DATE,
        dwr_employees.supervisor_id

    FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Training" training ON training."id" = dwr.training_record_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
       
        GROUP BY
        dwr_employees.employee_id,
        dwr_employees.begining_day :: DATE,
        concat(employees.first_name, ' ', employees.last_name),
        dwr_employees."module",
        dwr_employees.supervisor_id

        ORDER BY
        begining_day DESC;


        SELECT
        Distinct(dwr_employees.employee_id),
        concat(employees.first_name, ' ', employees.last_name) AS employee_name,
        SUM (
            ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
        ) AS total_hours ,
        dwr_employees."module" AS module,
        dwr_employees.begining_day :: DATE,
        dwr_employees.supervisor_id

    FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Trainee" trainee ON trainee."id" = dwr.trainee_record_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
        ${where}
       
        GROUP BY
        dwr_employees.employee_id,
        dwr_employees.begining_day :: DATE,
        concat(employees.first_name, ' ', employees.last_name),
        dwr_employees."module",
        dwr_employees.supervisor_id

        ORDER BY
        begining_day DESC;


        SELECT
        Distinct(dwr_employees.employee_id),
        concat(employees.first_name, ' ', employees.last_name) AS employee_name,
        SUM (
            ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
        ) AS total_hours ,
        dwr_employees."module" AS module,
        dwr_employees.begining_day :: DATE,
        dwr_employees.supervisor_id

    FROM
        "Bridge_DailyTasks_DWR" bridge
        INNER JOIN "DWR_Employees" dwr_employees ON dwr_employees."id" = bridge.dwr_id 
        INNER JOIN "DWR" dwr ON dwr."id" = bridge.task_id
        INNER JOIN "Trainer_Training_Tasks" trainer ON trainer."id" = dwr.trainer_record_id 
        INNER JOIN "Employees" employees ON dwr_employees.employee_id = employees.ID :: VARCHAR 

        WHERE 
        dwr_employees.is_active = FALSE
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
       
    }

    else if (operation === 'getDWRList') {
        
    }

    return getDwr;
}