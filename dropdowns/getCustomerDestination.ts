import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const customer_id = req.query.customer_id;
    const farm_id = req.query.farm_id;

    try {
        const search: string = req.query.search;
        let whereClause: string = `WHERE "is_deleted" = false`;

        if (search) whereClause = ` ${whereClause} AND LOWER("name") LIKE LOWER('%${search}%')`;

        let customer_info_query = `
            SELECT * 
            FROM 
            
            "Customer_Destination"

            ${whereClause}
            AND customer_id = '${customer_id}'
            AND farm_id = '${farm_id}'

            ORDER BY 
            "name" ASC
          ;`;

        let customer_count_query = `
        SELECT COUNT("id")
        FROM "Customer_Destination"
        ${whereClause}
        AND customer_id = '${customer_id}'
        AND farm_id = '${farm_id}'
        ;
      `;

    let query = `${customer_info_query} ${customer_count_query}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            customers: result[0].rows,
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
