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

        let whereClause: string = ` WHERE "is_deleted" = FALSE AND "status" = TRUE`;

        if (search) whereClause = ` ${whereClause} AND LOWER(type) LIKE LOWER('%${search}%')`;

        let machinery_query = `
        SELECT "id", "type" FROM  "Machinery"  ${whereClause} ORDER BY  "type" ASC;`;

        let machinery_count_query = `SELECT COUNT("id") FROM "Machinery" ${whereClause};`;

        let query = `${machinery_query} ${machinery_count_query}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            machinery: result[0].rows,
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
