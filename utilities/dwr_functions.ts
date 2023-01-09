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
        optionalReq = `${optionalReq},"beginning_seperators_hours"`;
        optionalValues = `${optionalValues},'${dwr.beginning_separator_hours}'`
    }

    if (dwr.field_id != null) {
        optionalReq = `${optionalReq},"beginning_engine_hours"`;
        optionalValues = `${optionalValues},'${dwr.field_id}'`
    }

    let query = `
        INSERT INTO 
                    "DWR" 
                    ("employee_id",
                    work_order_id,
                    dwr_type
                    ${optionalReq})
  
        VALUES      ('${dwr.employeeId}',
                    '${dwr.workOrderId}',
                    '${dwr.dwr_type}'
                    ${optionalValues});
      `;

    console.log(query);
    return query;
}

export function updateDWR(closingOfDay: any) {
    // If user make a call from Existing Work Order of Tractor Driver
    let optionalReq: string = ``;

    if (closingOfDay.acresCompleted != null) {
        optionalReq = `${optionalReq},"acres_completed" = '${closingOfDay.acresCompleted}'`;
    }

    if (closingOfDay.gpsAcres != null) {
        optionalReq = `${optionalReq},"gps_acres" = '${closingOfDay.gpsAcres}'`;
    }

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
        optionalReq = `${optionalReq},"ending_seperators_hours" = '${closingOfDay.ending_separator_hours}'`;
    }

    let query = `
    UPDATE 
        "DWR"
    SET 
        "is_day_closed" = 'true'
         ${optionalReq}
    WHERE 
        "work_order_id" = '${closingOfDay.workOrderId}' AND is_day_closed = 'false' ;`

    console.log(query);
    return query;
}
