import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const role: string = req.query.role;
    const search: string = req.query.search;

    try {
        let whereClause: string = `WHERE emp."is_deleted" = false`;

        if (search) whereClause = ` ${whereClause} And Lower(emp."first_name") LIKE Lower('%${search}%')`;

        if (role) {
            let types = role.split(",");
            types.forEach((role, index) => {
                if (index === 0)
                    whereClause = ` ${whereClause} AND ( emp."role" LIKE '%' || '${role}' || '%'`;
                else if (index > 0)
                    whereClause = ` ${whereClause} OR emp."role" LIKE '%' || '${role}' || '%'`;
            });
            whereClause = ` ${whereClause} )`
        }

        let query = `
       
        SELECT 
        emp.id,
        emp.first_name,
        emp.last_name,
        emp.dht_supervisor_id AS supervisor_id,
        CONCAT(supervisor.first_name, ' ', supervisor.last_name) AS supervisor_name,
        emp.is_guest_user
        
        FROM "Employees" emp
        LEFT JOIN "Employees" supervisor ON emp.dht_supervisor_id::VARCHAR = supervisor.id::VARCHAR

        ${whereClause}
        ORDER BY 
        emp."first_name" ASC;
      `;

        console.log("Get All Employees: ", query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            employees: result.rows
        };

        db.end();

        context.res = {
            status: 200,
            body: resp,
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