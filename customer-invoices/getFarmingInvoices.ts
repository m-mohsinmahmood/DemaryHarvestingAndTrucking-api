import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const customer_id: string = req.query.customer_id;

    console.log(req.query);

    try {
        let queryToRun = ``;
        let count_query = ``;

        queryToRun = `
        select * from "Farming_Invoice" where customer_id = '${customer_id}' AND is_deleted = false
        ;`;

        count_query = `
            SELECT  COUNT(id) from "Farming_Invoice" where customer_id = '${customer_id}' AND is_deleted = false;`;

        let query = `${queryToRun} ${count_query}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            invoices: result[0].rows,
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
