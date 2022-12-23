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
        const workOrder: beginningOfDay = req.body;

        let query = ``;

        // If user make a call from Existing Work Order of Tractor Driver

        let optionalReq: string = ``;

        if (workOrder.acresCompleted != null) {
            optionalReq = `${optionalReq}"acres_completed" = '${workOrder.acresCompleted}'`;
        }

        if (workOrder.gpsAcres != null) {
            optionalReq = `${optionalReq},"gps_acres" = '${workOrder.gpsAcres}'`;
        }

        if (workOrder.endingEngineHours != null) {
            optionalReq = `${optionalReq},"ending_engine_hours" = '${workOrder.endingEngineHours}'`;
        }

        if (workOrder.hoursWorked != null) {
            optionalReq = `${optionalReq},"hours_worked" = '${workOrder.hoursWorked}'`;
        }

        if (workOrder.notes != null) {
            optionalReq = `${optionalReq},"notes" = '${workOrder.notes}'`;
        }

        query = `
        UPDATE 
                "DWR"
        SET 
              ${optionalReq}
        WHERE 
                "employee_id" = '${workOrder.employeeId}';`

        db.connect();
        console.log(query);

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Close Out Work Order has been updated successfully.",
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
