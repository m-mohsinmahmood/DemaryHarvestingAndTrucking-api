import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const id: string = req.query.id;

    try {
        let whereClause: string = `WHERE "is_deleted" = false`;

        let ticket = `
        SELECT 
        * 
        FROM 
        "Pre_Trip_Check"

       ${whereClause} AND id = '${id}';
      `;

        let query = `${ticket}`;

        console.log(ticket);

        db.connect();

        let result = await db.query(query);

        let resp = {
            ticket: result.rows
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
