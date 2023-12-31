import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { Motorized } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const motorized: Motorized = req.body;

    try {
        let query = `
        UPDATE 
        "Motorized_Vehicles"
   
        SET 
        "odometer_reading_end" = '${motorized.endingEngineHours}'
   
        WHERE 
        "id" = '${motorized.id}' ;`;

        console.log(query);

        db.connect();

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Ending Engine Hours has been updated successfully.",
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
