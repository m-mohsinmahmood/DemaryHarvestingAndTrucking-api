import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const customer_id: string = req.query.customer_id;
    const service_type: string = req.query.service_type;
    const to: string = req.query.to;
    const from: string = req.query.from;
    const quantityType: string = req.query.quantity_type;

    console.log(req.query);

    let whereClause = ``;
    if (from) whereClause = ` ${whereClause}  AND '${from}' <= created_at::"date"`;
    if (to) whereClause = ` ${whereClause}  AND '${to}' >= created_at::"date"`;
    if (service_type) whereClause = ` ${whereClause}  AND service = '${service_type}'`;
    if (quantityType) whereClause = ` ${whereClause}  AND quantity_type = '${quantityType}'`;

    try {

        let queryToRun = `
        SELECT *FROM "Farming_Work_Order"
        WHERE customer_id = '${customer_id}' 
        ${whereClause}
        AND ("work_order_status" <> 'invoiced' OR "work_order_status" <> 'paid')
        AND is_deleted = FALSE
        ORDER BY created_at ASC;
        ;`;

        let query = `${queryToRun}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            jobResults: result.rows
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
