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
        const id = req.query.ticketId;
        console.log('Request::', req.body);

        query = `
         UPDATE 
                 "Customer_Job_Setup"
         SET 
                "is_trip_check_filled"  = FALSE,
                "is_job_active"         = FALSE,
                "is_job_completed"      = TRUE                 
         WHERE 
                 "id" = '${id}';`

        console.log('Query:', query)
        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Job has been closed successfully.",
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
