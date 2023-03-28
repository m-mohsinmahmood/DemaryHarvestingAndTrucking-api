import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    let where = ``;

    try {
        const updateTicket: beginningOfDay = req.body;
       let optionalReq = ``;

        if (updateTicket.notes != null) {
            optionalReq = `${optionalReq},"notes" = '${updateTicket.notes}'`;
        }
        if (updateTicket.employee_id !== '') {
            where = `${where} AND "employee_id" = '${updateTicket.employee_id}'`;
        }

        let query = `
    UPDATE 
        "DWR"
    SET 
        "status" = '${updateTicket.status}',
        "modified_at"   = 'now()'
         ${optionalReq}
    WHERE 
        "id" = '${updateTicket.dwrId}'
        ${where} ;`

        console.log(query);

        db.connect();

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "DWR has been updated successfully.",
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
