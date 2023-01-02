import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const customer_id: string = req.query.customerId;
        let whereClause: string = `WHERE "customer_id" = '${customer_id}' AND "is_deleted" = false`;

        let trucking_rates_query = `
        SELECT 
                "id",
                "customer_id",
                "rate_type", 
                "rate",
                "created_at"
        FROM
                "Trucking_Rates"
        ${whereClause};
      `;

        let count_query = `
      SELECT  COUNT("id") FROM "Trucking_Rates" ${whereClause};`;

        let query = `${trucking_rates_query} ${count_query}`;

        console.log(query);


        db.connect();

        let result = await db.query(query);

        let resp = {
            truckingRates: result[0].rows,
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
