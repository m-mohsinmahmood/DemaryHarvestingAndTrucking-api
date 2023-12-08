import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { data } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const data: data = req.body;

        let query = `
        UPDATE "Customer_Cost_Operational_Data" 

        SET 
            "created_year"                      = '${data.created_year}', 
            "customer_lodging_rate"             = '${data.customer_lodging_rate}', 
            "customer_miscellaneous_expense"    = '${data.customer_miscellaneous_expense}', 
            "modified_at"                       = 'now()'
        WHERE 
            "id" = '${data.id}';
        `;

        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Data has been updated successfully.",
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
