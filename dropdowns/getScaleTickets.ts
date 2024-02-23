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
        const customer_id: string = req.query.customer_id;

        let whereClause: string = ` WHERE "is_deleted" = FALSE  AND "scale_ticket_number" NOTNULL AND "customer_id" = '${customer_id}'`;

        if (search) whereClause = ` ${whereClause} AND scale_ticket_number::text LIKE '%${search}%'`;

        let machinery_query = `
        SELECT scale_ticket_number from "Harvesting_Delivery_Ticket"  ${whereClause} ORDER BY scale_ticket_number;`;

        let machinery_count_query = `SELECT COUNT("scale_ticket_number") FROM "Harvesting_Delivery_Ticket" ${whereClause};`;

        let query = `${machinery_query} ${machinery_count_query}`;

        await db.connect();

        let result = await db.query(query);

        let resp = {
            scale_tickets: result[0].rows,
            count: +result[1].rows[0].count
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
