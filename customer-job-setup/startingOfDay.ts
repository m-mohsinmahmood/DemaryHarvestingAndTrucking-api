import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    let query = ``;
    try {
        const supervisor_id = req.body.supervisor_id;
        const active_check_in_id = req.body.active_check_in_id;

        query = `
            UPDATE 
            "DWR_Employees"
                    
            SET 
            "supervisor_id" = '${supervisor_id}',
            "module" = 'harvesting',
            "modified_at" = CURRENT_TIMESTAMP
                         
            WHERE 
            "id" = '${active_check_in_id}' ;`

        console.log('Query:', query)
        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Day has begun successfully.",
                status: 200,
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
