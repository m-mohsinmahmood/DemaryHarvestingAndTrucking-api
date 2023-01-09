import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";
import { createDWR } from "../utilities/dwr_functions";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const order: beginningOfDay = req.body;

        let query = createDWR(order);
        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "DWR has been created successfully",
                status: 200
            },
        };

        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
