import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const employeeId = req.body.id;

    try {
        let query = `
        Update 

        "Employees"
    
        SET
        dht_supervisor_id = ''

        Where id = '${employeeId}'
      ;`;

        console.log(query);

        db.connect();

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Employee has been updated successfully.",
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
