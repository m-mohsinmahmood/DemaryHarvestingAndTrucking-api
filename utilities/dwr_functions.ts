import * as _ from "lodash";

export function createDWR(dwr: any) {
    let optionalReq: string = ``;
    let optionalValues: string = ``;

    if (dwr.machineryId != null) {
        optionalReq = `${optionalReq},"machinery_id"`;
        optionalValues = `${optionalValues},'${dwr.machineryId}'`
    }

    if (dwr.beginningEngineHours != null) {
        optionalReq = `${optionalReq},"beginning_engine_hours"`;
        optionalValues = `${optionalValues},'${dwr.beginningEngineHours}'`
    }

    if (dwr.beginning_separator_hours != null) {
        optionalReq = `${optionalReq},"beginning_separator_hours"`;
        optionalValues = `${optionalValues},'${dwr.beginning_separator_hours}'`
    }

    if (dwr.field_acres != null) {
        optionalReq = `${optionalReq},"field_acres"`;
        optionalValues = `${optionalValues},'${dwr.field_acres}'`;
    }

    if (dwr.truck_id != null) {
        optionalReq = `${optionalReq},"truck_id"`;
        optionalValues = `${optionalValues},'${dwr.truck_id}'`;
    }

    if (dwr.crew_chief != null) {
        optionalReq = `${optionalReq},"crew_chief"`;
        optionalValues = `${optionalValues},'${dwr.crew_chief}'`;
    }

    if (dwr.truck_company != null) {
        optionalReq = `${optionalReq},"truck_company"`;
        optionalValues = `${optionalValues},'${dwr.truck_company}'`;
    }

    if (dwr.begining_odometer_miles != null) {
        optionalReq = `${optionalReq},"begining_odometer_miles"`;
        optionalValues = `${optionalValues},'${dwr.begining_odometer_miles}'`;
    }
    if (dwr.state != null) {
        optionalReq = `${optionalReq},"state"`;
        optionalValues = `${optionalValues},'${dwr.state}'`;
    }
    if (dwr.supervisor_id != null) {
        optionalReq = `${optionalReq},"supervisor_id"`;
        optionalValues = `${optionalValues},'${dwr.supervisor_id}'`;
    }
    if (dwr.apprTaskId != null) {
        optionalReq = `${optionalReq},"apprTaskId"`;
        optionalValues = `${optionalValues},'${dwr.apprTaskId}'`;
    }
    if (dwr.notesOther != null) {
        optionalReq = `${optionalReq},"notesOther"`;
        optionalValues = `${optionalValues},'${dwr.notesOther}'`;
    }
    if (dwr.workOrderId != null) {
        optionalReq = `${optionalReq},"work_order_id"`;
        optionalValues = `${optionalValues},'${dwr.workOrderId}'`;
    }

    if (dwr.deliveryTicketId != null) {
        optionalReq = `${optionalReq},"delivery_ticket_id"`;
        optionalValues = `${optionalValues},'${dwr.deliveryTicketId}'`;
    }

    if (dwr.jobId != null) {
        optionalReq = `${optionalReq},"job_id"`;
        optionalValues = `${optionalValues},'${dwr.jobId}'`;
    }
    if (dwr.main_repair_ticket_id != null) {
        optionalReq = `${optionalReq},"main_repair_ticket_id"`;
        optionalValues = `${optionalValues},'${dwr.main_repair_ticket_id}'`;
    }
    if (dwr.training_record_id != null) {
        optionalReq = `${optionalReq},"training_record_id"`;
        optionalValues = `${optionalValues},'${dwr.training_record_id}'`;
    }
    if (dwr.trainee_record_id != null) {
        optionalReq = `${optionalReq},"trainee_record_id"`;
        optionalValues = `${optionalValues},'${dwr.trainee_record_id}'`;
    }
    if (dwr.trainer_record_id != null) {
        optionalReq = `${optionalReq},"trainer_record_id"`;
        optionalValues = `${optionalValues},'${dwr.trainer_record_id}'`;
    }
    if (dwr.other_record_id != null) {
        optionalReq = `${optionalReq},"other_record_id"`;
        optionalValues = `${optionalValues},'${dwr.other_record_id}'`;
    }
    if (dwr.evaluation_type != null) {
        optionalReq = `${optionalReq},"evaluation_type"`;
        optionalValues = `${optionalValues},'${dwr.evaluation_type}'`;
    }
    if (dwr.evaluation_form != null) {
        optionalReq = `${optionalReq},"evaluation_form"`;
        optionalValues = `${optionalValues},'${dwr.evaluation_form}'`;
    }
    if (dwr.role != null) {
        optionalReq = `${optionalReq},"role"`;
        optionalValues = `${optionalValues},'${dwr.role}'`;
    }
    if (dwr.initialyCreated != null) {
        optionalReq = `${optionalReq},"initialy_created"`;
        optionalValues = `${optionalValues},'${dwr.initialyCreated}'`;
    }
    if (dwr.taskType != null) {
        optionalReq = `${optionalReq},"taskType"`;
        optionalValues = `${optionalValues},'${dwr.taskType}'`;
    }

    let query = ``;

    if (dwr.dwr_type === 'training' || dwr.dwr_type === 'maintenance-repair') {
        query = `
        INSERT INTO 
                    "DWR" 
                    ("employee_id",
                    dwr_type,
                    modified_at,
                    is_day_closed
                    ${optionalReq})
  
        VALUES      ('${dwr.employeeId}',
                    '${dwr.dwr_type}',
                    'now()',
                    'TRUE'
                    ${optionalValues})
                    
                    returning id;
      `;

    } else {
        query = `
        INSERT INTO 
                    "DWR" 
                    ("employee_id",
                    dwr_type
                    ${optionalReq})
  
        VALUES      ('${dwr.employeeId}',
                    '${dwr.dwr_type}'
                    ${optionalValues})
                    ;
      `;
    }

    console.log(query);
    return query;
}

export function updateDWR(closingOfDay: any) {
    // If user make a call from Existing Work Order of Tractor Driver
    let optionalReq: string = ``;

    if (closingOfDay.endingEngineHours != null) {
        optionalReq = `${optionalReq},"ending_engine_hours" = '${closingOfDay.endingEngineHours}'`;
    }

    if (closingOfDay.hoursWorked != null) {
        optionalReq = `${optionalReq},"hours_worked" = '${closingOfDay.hoursWorked}'`;
    }

    if (closingOfDay.notes != null) {
        optionalReq = `${optionalReq},"notes" = '${closingOfDay.notes}'`;
    }

    if (closingOfDay.ending_separator_hours != null) {
        optionalReq = `${optionalReq},"ending_separator_hours" = '${closingOfDay.ending_separator_hours}'`;
    }

    if (closingOfDay.ending_odometer_miles != null) {
        optionalReq = `${optionalReq},"ending_odometer_miles" = '${closingOfDay.ending_odometer_miles}'`;
    }

    let ticket = ``;

    if (closingOfDay.workOrderId)
        ticket = `"work_order_id" = '${closingOfDay.workOrderId}'`;
    else if (closingOfDay.deliveryTicketId)
        ticket = `"delivery_ticket_id" = '${closingOfDay.deliveryTicketId}'`;
    else if (closingOfDay.jobId)
        ticket = `"job_id" = '${closingOfDay.jobId}'`;

    let query = `
    UPDATE 
        "DWR"
    SET 
        "is_day_closed" = 'true',
        "modified_at"   = 'now()'
         ${optionalReq}
    WHERE 
        ${ticket} AND is_day_closed = 'false' 
        returning id;`

    console.log(query);
    return query;
}
