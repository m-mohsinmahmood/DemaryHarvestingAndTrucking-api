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

        let whereClause: string = ` WHERE "is_deleted" = FALSE AND "customer_id" = '${customer_id}'`;

        if (search) whereClause = ` ${whereClause} AND LOWER(equipment_type) LIKE LOWER('%${search}%')`;

        let customer_farm_query = `
        select equipment_type as service from "Farming_Rates"  
        ${whereClause}
        ORDER BY 
        "equipment_type" ASC`;

        let query = `${customer_farm_query}`;
        console.log(query);

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
