import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const id: string = req.query.id;
        const login: string = req.query.login_time;
        const logout: string = req.query.logout_time;
        const notes: string = req.query.employee_notes;

        db.connect();

        let query = ` 
        UPDATE 
        "DWR_Employees"
        
        SET 
        "dwr_status" = 'pendingVerification',
        "begining_day" = '${login}',
        "ending_day" = '${logout}',
        "modified_at" = 'now()',
        "employee_notes" = $$${notes}$$

        where  id = '${id}'
            ;`;

        let result = await db.query(query);

        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Dwr has been updated successfully.",
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
