import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_update, job_close } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    let query = ``;
    try {
        const id = req.body.id;
        const acres = req.body.acres;

        query = `
         UPDATE 
                 "Customer_Job_Setup"
         SET 
                "crop_acres" = '${acres}' 
         WHERE 
                 "id" = '${id}';`

        console.log('Query:', query)
        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Job has been updated successfully.",
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
