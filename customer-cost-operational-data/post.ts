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
        INSERT INTO 
                  "Customer_Cost_Operational_Data" 
                  ("customer_id", 
                  "created_year", 
                  "customer_lodging_rate",
                  "customer_miscellaneous_expense"
                  )
        VALUES 
                  ('${data.customer_id}', 
                  '${data.created_year}', 
                  '${data.customer_lodging_rate}',
                  '${data.customer_miscellaneous_expense}'
                  );
    `;
        db.connect();
        await db.query(query);
        db.end();
        //#endregion
        //#region Success Response
        context.res = {
            status: 200,
            body: {
                message: "Cost Operational Data of Customer has been successfully created",
            },
        };
        context.done();
        return;
        //#endregion
    } catch (error) {
        //#region Error Response
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        context.done();
        return;
        //#endregion
    }
};

export default httpTrigger;
