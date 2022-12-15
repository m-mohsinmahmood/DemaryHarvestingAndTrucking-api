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
        const customer_type: string = req.query.customerType;

        let whereClause: string = ` WHERE "is_deleted" = FALSE AND "id" = '${customer_id}'`;

        if (search) whereClause = ` ${whereClause} AND LOWER(name) LIKE LOWER('%${search}%')`;

        if (customer_type) {
            let types = customer_type.split(",");
            types.forEach((customer_type, index) => {
                if (index === 0)
                    whereClause = ` ${whereClause} AND ( "customer_type" LIKE '%' || '${customer_type}' || '%'`;
                else if (index > 0)
                    whereClause = ` ${whereClause} OR "customer_type" LIKE '%' || '${customer_type}' || '%'`;
            });
            whereClause = ` ${whereClause} )`
        }

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

        let resp = {
            customer_farms: result.rows
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
