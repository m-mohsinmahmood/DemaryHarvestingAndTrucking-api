import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const role = req.query.role;
    const employeeId = req.query.employeeId
    let query = ``;

    try {
        if (role === 'Crew Chief') {
            query = `
            SELECT
            cjs.created_at :: "date",
            cjs.ID AS job_id,
            customers."id" AS customer_id,
            concat ( customers.customer_name ) AS customer_name,
            cjs."state",
            farm."id" AS farm_id,
            farm."name" AS farm_name,
            crop."id" AS crop_id,
            crop."name" 
        
            FROM
            "Customer_Job_Setup" cjs
            INNER JOIN "Customers" customers ON cjs.customer_id = customers."id"
            INNER JOIN "Customer_Farm" farm ON cjs.farm_id = farm."id"
            INNER JOIN "Crops" crop ON cjs.crop_id = crop.ID 
        
            WHERE
            cjs.crew_chief_id = '${employeeId}'
        ;`;
        }

        db.connect();
        let result = await db.query(query);
        let resp = {
            jobs: result.rows
        };

        db.end();

        context.res = {
            status: 200,
            body: resp
        };
    } catch (err) {
        db.end();
        context.res = {
            status: 500,
            body: err,
        };
    }
    context.done();
    return;
};

export default httpTrigger;
