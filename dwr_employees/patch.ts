import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { dwr } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const dwr: dwr = req.body;
    const moment = require('moment');
    const formattedDate = moment.utc().format('MM/DD/YYYY hh:mm:ss A');

    try {
        let query = `
        UPDATE 
        "DWR_Employees"
   
        SET 
        "is_active" = FALSE,
        "dwr_status" = 'pendingVerification',
        "modified_at"   = '${formattedDate}',
        "ending_day"   = '${formattedDate}'
        
        WHERE 
        "id" = '${dwr.id}' ;`;

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
