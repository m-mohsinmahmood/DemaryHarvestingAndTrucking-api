import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { editFarmingJob } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const updateTicket: editFarmingJob = req.body.data;

        console.log(req.body);

        let optionalReqTDT = ``;

        if (updateTicket.hours_worked != null) {
            optionalReqTDT = `${optionalReqTDT} "hours_worked" = '${updateTicket.hours_worked}'`;
        }
        if (updateTicket.acres_completed != null) {
            optionalReqTDT = `${optionalReqTDT},"acres_completed" = '${updateTicket.acres_completed}'`;
        }
        



      



        let editFarmingDeliveryTicket = `
    UPDATE 
        "Farming_Work_Order"
    SET 
             ${optionalReqTDT}
    WHERE 
        "id" = '${updateTicket.id}' ;`

        // let editEmployees = `
        // UPDATE 
        //     "Employees"
        // SET 
        //     ${optionalEmployees}
        // WHERE 
        //     "id" = '${updateTicket.id}' ;`

        db.connect();

        let queryToRun = `${editFarmingDeliveryTicket}`;

        let result = await db.query(queryToRun);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Work Order has been updated successfully.",
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
