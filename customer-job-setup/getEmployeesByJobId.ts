import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const crewCheifId = req.query.crewCheifId;
    const jobId = req.query.jobId;
    let query = ``;

    try {
        query = 
        `
        SELECT 
            employee.first_name, employee.last_name, har.role
        FROM 
            "Customer_Job_Setup" cjs 
            INNER JOIN "DWR" dwr ON cjs.id = dwr.job_id AND cjs."id" = '${jobId}'
            INNER JOIN "Harvesting_Assigned_Roles" har ON har.employee_id::VARCHAR = dwr.employee_id::VARCHAR
			INNER JOIN "Employees" employee ON employee."id" = dwr.employee_id AND employee.dht_supervisor_id = '${crewCheifId}'
            GROUP BY employee.id, har."role"
            ;`;

        await db.connect();
        let result = await db.query(query);
        let resp = {
            employees: result.rows
        };

        context.res = {
            status: 200,
            body: resp
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: err,
        };
    }

    finally {
        db.end();
        context.done();
    }
};

export default httpTrigger;
