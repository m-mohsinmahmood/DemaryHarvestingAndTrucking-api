import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const employeeId: string = req.query.employeeId;

        let dwr = `
            select * from "DWR_Employees"
            Where employee_id = '${employeeId}' AND is_active = TRUE
      
            ;`;

        let query = `${dwr}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            dwr: result.rows
        };

        db.end();

        context.res = {
            status: 200,
            body: resp,
        };

        context.done();
        return;
    } catch (err) {
        db.end();
        context.res = {
            status: 500,
            body: err,
        };
        context.done();
        return;
    }
};

export default httpTrigger;
