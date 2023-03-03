import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { editCustomerJob } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const updateTicket: editCustomerJob = req.body.data;

        console.log(req.body);

        let optionalReqTDT = ``;
        let optionalEmployees = ``;

        if (updateTicket.total_job_miles != null) {
            optionalReqTDT = `${optionalReqTDT} "total_job_miles" = '${updateTicket.total_job_miles}'`;
        }
        if (updateTicket.weightLoad != null) {
            optionalReqTDT = `${optionalReqTDT},"weightLoad" = '${updateTicket.weightLoad}'`;
        }
        if (updateTicket.hours_worked != null) {
            optionalReqTDT = `${optionalReqTDT},"hours_worked" = '${updateTicket.hours_worked}'`;
        }
        



      



        let editTruckingDeliveryTicket = `
    UPDATE 
        "Trucking_Delivery_Ticket"
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

        let queryToRun = `${editTruckingDeliveryTicket}`;

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
