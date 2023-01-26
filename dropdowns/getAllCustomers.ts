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
        const status: string = req.query.status;
        let whereClause: string = `WHERE "is_deleted" = false`;

        if (search) whereClause = ` ${whereClause} AND LOWER("customer_name") LIKE LOWER('%${search}%')`;
        if (status) whereClause = ` ${whereClause} AND "status" = ${(status === 'true')}`;

        let customer_info_query = `
            SELECT * 
            FROM 
                  "Customers"
            ${whereClause}
          ;`;

        let customer_count_query = `
        SELECT COUNT("id")
        FROM "Customers"
        ${whereClause};
      `;

    let query = `${customer_info_query} ${customer_count_query}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            customers: result[0].rows,
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
