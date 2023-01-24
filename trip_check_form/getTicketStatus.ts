import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const employeeId: string = req.query.employeeId;

    try {
        let whereClause: string = `WHERE ptc."is_deleted" = false`;

        let from = `FROM 
        "Pre_Trip_Check" ptc 
         INNER JOIN "Employees" emp
         on ptc.employee_id = emp.id
         
        ${whereClause}  AND ptc."employee_id" = '${employeeId}'
        AND ptc.is_ticket_active=TRUE AND ptc."is_ticket_completed" = FALSE`;

        let ticket = `
        SELECT 
                  
        ptc."id",
        ptc."created_at",
        ptc."is_category1_completed",
        ptc."is_category2_completed",
        ptc."is_category3_completed",
        ptc."is_category4_completed",
        ptc."is_category5_completed",
        emp.first_name as inspected_by
        ${from}
        ;`;

        let count_query = `
        SELECT  COUNT(ptc."id") ${from};`;

        let query = `${ticket} ${count_query}`;
        console.log(query);
        
        db.connect();

        let result = await db.query(query);

        let resp = {
            ticket: result[0].rows,
            count: +result[1].rows[0].count,
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
