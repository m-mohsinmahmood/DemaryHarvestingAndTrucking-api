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
        const customer_id: string = req.query.customerId;

        console.log(req.query);
        
        let whereClause: string = ` WHERE "is_deleted" = FALSE AND "id" = '${customer_id}'`;

        if (search) whereClause = ` ${whereClause} AND LOWER(customer_type) LIKE LOWER('%${search}%')`;

        let customer_farm_query = `
        SELECT 
        "id",
        "customer_type"
         FROM 
        "Customers" 
        ${whereClause}
        ORDER BY 
        "id" ASC`;

        let query = `${customer_farm_query}`;

        db.connect();

        let result = await db.query(query);
        console.log(result.rows);
        
        const arr = result.rows[0].customer_type.split(',');

        console.log(arr);

        let resp = {
            customer_farms: arr
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
