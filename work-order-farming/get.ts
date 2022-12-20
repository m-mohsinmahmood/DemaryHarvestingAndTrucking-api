import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const search: string = req.query.search;
    const sort: string = req.query.sort ? req.query.sort : `created_at`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = ` WHERE "is_deleted" = FALSE`;

    if (search) whereClause = ` ${whereClause} AND LOWER("last_name") LIKE LOWER('%${search}%')`;
    try {
        // const customer_field_id: string = req.query.id;

        //     let queryGetCustomers = `
        //     SELECT 
        //             wo."id" AS "work_order__id", 
        //             c."id" as "customer_id", 
        //             c."customer_name" as "customer_first_name"
        //     FROM 
        //             "Farming_Work_Order" wo
        //             INNER JOIN "Customers" c 
        //             ON wo."customer_id" = c."id"

        // 			Where wo.work_order_close_out = false;
        //   `;

        let queryGetCustomers = `
        SELECT 
                "id",
                "first_name",
                "last_name",
                "role",
                "email",  
                "cell_phone_number",
                "us_phone_number",
                "status",
                "created_at"
        FROM 
                "Employees"
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
      `;

        let count_query = `
      SELECT 
              COUNT(wo."id")   FROM 
              "Farming_Work_Order" wo
              INNER JOIN "Customers" c 
              ON wo."customer_id" = c."id"
                              
              Where wo.work_order_close_out = false;`;

        let query = `${queryGetCustomers}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            customer_fields: result.rows
            // count: +result[1].rows[0].count,
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
