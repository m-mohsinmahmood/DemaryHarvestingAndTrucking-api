
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    let updateEndingOMR = ``;

    try {
        const id = req.body.jobId;
        const role = req.body.role;
        const endingEngineHours = req.body.endingEngineHours

        console.log('Request::', req.body);

        updateEndingOMR = `
            UPDATE 
                    "Motorized_Vehicles"
            SET 
                    "odometer_reading_end" = '${endingEngineHours}',
                    modified_at = now()
                  
            WHERE 
                    "id" = '${id}' ;`;

        console.log('Query:', updateEndingOMR)
        db.connect();
        let result = await db.query(updateEndingOMR);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Motorized Vehicle has been updated",
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
