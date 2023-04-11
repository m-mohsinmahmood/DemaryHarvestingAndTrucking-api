import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const search: string = req.query.search;
        let whereClause: string = `WHERE "is_deleted" = false`;

        if (search) whereClause = ` ${whereClause} And Lower("first_name") LIKE Lower('%${search}%')`;

        let role: any = req.query.role.split(',');

        if (Array.isArray(role)) {
            role = role.map((r) => ` '%' || '${r}' || '%' `).join(" OR ");
            whereClause = `${whereClause} AND ("role" LIKE ${role})`;
        }

        // role = role.map(r =>{
        //     if(r)
        // })

        let employees_dropdown_query = `
        SELECT * FROM "Employees" 
        ${whereClause}
        ORDER BY 
        "first_name" ASC;
      `;

        let employees_field_count_query = `
      SELECT 
              COUNT("id") from
              "Employees" 
              ${whereClause};`;

        let query = `${employees_dropdown_query} ${employees_field_count_query}`;

        console.log("Get All Employees: ", query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            employees: result[0].rows,
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
