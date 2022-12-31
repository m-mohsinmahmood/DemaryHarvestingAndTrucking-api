import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const closingOfDay: beginningOfDay = req.body;

        let query = ``;

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
            optionalReq = `${optionalReq},"ending_separator_hours" = '${closingOfDay.ending_separator_hours}'`;
        }
        if (closingOfDay.ending_odometer_miles != null) {
            optionalReq = `${optionalReq},"ending_odometer_miles" = '${closingOfDay.ending_odometer_miles}'`;
        }


        query = `
        UPDATE 
                "DWR"
        SET 
             "is_day_closed"                         = 'true'
              ${optionalReq}
        WHERE 
                "employee_id" = '${closingOfDay.employeeId}' AND is_day_closed = 'false' ;`

        db.connect();
        console.log(query);

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Close Out Work Order has been updated successfully.",
                status: 200
            },
        };
        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
