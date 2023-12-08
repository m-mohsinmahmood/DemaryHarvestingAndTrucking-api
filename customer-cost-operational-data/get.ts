import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const customer_id: String = req.query.customer_id;
        const page: number = +req.query.page ? +req.query.page : 1;
        const limit: number = +req.query.limit ? +req.query.limit : 10;
        const sort: string = req.query.sort ? req.query.sort : `created_at`;
        const order: string = req.query.order ? req.query.order : `desc`;

        let whereClause: string = ` WHERE "is_deleted" = false AND customer_id = '${customer_id}'`;

        let info_query = `
        SELECT 
        
            id,
            customer_id,
            created_year,
            customer_lodging_rate,
            customer_miscellaneous_expense

        FROM 
              "Customer_Cost_Operational_Data" 
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

        let count_query = `
        SELECT COUNT(id)
        FROM "Customer_Cost_Operational_Data" 
        ${whereClause};
      `;

        let query = `${info_query} ${count_query}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            data: result[0].rows,
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
