
export function GetTrainingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, operation, status: any) {

    let getDwr = ``;

    let where = ``;
    let whereSubQuery = ``;

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
        dwr_employees.supervisor_id,
				 (SELECT
       supervisor_id as last_supervisor_id

    FROM
      "DWR_Employees"
        
        WHERE 
      is_active = FALSE
        ${whereSubQuery}
				
				ORDER BY begining_day DESC
				LIMIT 1)

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
        dwr_employees.supervisor_id,
				(SELECT
       supervisor_id as last_supervisor_id

    FROM
      "DWR_Employees"
        
        WHERE 
      is_active = FALSE
		${whereSubQuery}
				
				ORDER BY begining_day DESC
				LIMIT 1)

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
        dwr_employees.supervisor_id,
				(SELECT
       supervisor_id as last_supervisor_id

    FROM
      "DWR_Employees"
        
        WHERE 
      is_active = FALSE
				${whereSubQuery}
				
				ORDER BY begining_day DESC
				LIMIT 1)

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
        'ticket_id', training.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', training."state",
        'supervisor_id', training.supervisor_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Training" training ON dwr.training_record_id = training."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON training.supervisor_id = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.begining_day ASC;


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
        'ticket_id', trainee.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', trainee."state",
        'supervisor_id', trainee.trainer_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Trainee" trainee ON dwr.trainee_record_id = trainee."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON trainee.trainer_id = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.begining_day ASC;


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
        'ticket_id', trainer_tasks.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', trainer_tasks."state",
        'supervisor_id', trainer_tasks.supervisor_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Trainer_Training_Tasks" trainer_tasks ON dwr.trainer_record_id = trainer_tasks."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON trainer_tasks.supervisor_id = supervisor."id"

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
        dwr_employees."supervisor_notes",
        dwr_employees."employee_notes",
            SUM (
                ROUND( CAST ( ( EXTRACT ( EPOCH FROM ( dwr_employees.ending_day - dwr_employees.begining_day ) ) / 3600 ) AS NUMERIC ), 2 ) 
            ) AS total_hours,
            
        json_agg(
        json_build_object(
        'ticket_id', training.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', training."state",
        'supervisor_id', training.supervisor_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Training" training ON dwr.training_record_id = training."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON training.supervisor_id = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.begining_day ASC;


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
        'ticket_id', trainee.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', trainee."state",
        'supervisor_id', trainee.trainer_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Trainee" trainee ON dwr.trainee_record_id = trainee."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON trainee.trainer_id = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.begining_day ASC;


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
        'ticket_id', trainer_tasks.id,
        'employee_id', emp.id,
        'employee_name', concat(emp.first_name, ' ', emp.last_name),
        'state', trainer_tasks."state",
        'supervisor_id', trainer_tasks.supervisor_id,
        'supervisor_name', concat(supervisor.first_name, ' ', supervisor.last_name)
        )) as tickets
        
        from "DWR_Employees" dwr_employees
        
        INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employees."id" = bridge.dwr_id
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Trainer_Training_Tasks" trainer_tasks ON dwr.trainer_record_id = trainer_tasks."id"
        INNER JOIN "Employees" emp ON emp."id"::VARCHAR = dwr_employees.employee_id
        INNER JOIN "Employees" supervisor ON trainer_tasks.supervisor_id = supervisor."id"

        WHERE dwr_employees.employee_id = '${employee_id}'
       ${where}
        AND dwr_employees.is_active = FALSE
        
        GROUP BY dwr_employees.id
        
        ORDER BY dwr_employees.begining_day ASC;

        `;

    }

    return getDwr;
}