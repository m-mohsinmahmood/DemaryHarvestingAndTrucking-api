import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingExpenses, getHaulingExpenses } from "./getExpenses";
const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const operation = req.query.operation;
    const customer_id = req.query.customer_id;

    try {

        let query = '';

        if (operation == 'getHarvestingExpenses')
            query = getHarvestingExpenses(customer_id);

        else if (operation == 'getHaulingExpenses')
            query = getHaulingExpenses(customer_id);

        db.connect();

        let result = await db.query(query);

        let resp = {
            data: result[0].rows,
            subTotals: result[1].rows
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
