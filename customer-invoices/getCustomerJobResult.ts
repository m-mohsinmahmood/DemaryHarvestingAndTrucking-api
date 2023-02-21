import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const customer_id: string = req.query.customer_id;
    const service_type: string = req.query.service_type;
    const to: string = req.query.to;
    const from: string = req.query.from;
    const quantityType: string = req.query.quantity_type;

    console.log(req.query);

    let whereClause = ``;
    let amountWhereClause = ``;

    if (from) whereClause = ` ${whereClause}  AND '${from}' <= created_at::"date"`;
    if (to) whereClause = ` ${whereClause}  AND '${to}' >= created_at::"date"`;
    if (service_type) whereClause = ` ${whereClause}  AND service = '${service_type}'`;
    if (service_type) amountWhereClause = ` ${amountWhereClause}  AND fr.equipment_type = '${service_type}'`;
    if (quantityType) whereClause = ` ${whereClause}  AND quantity_type = '${quantityType}'`;

    try {

        let totalAmount = `
        SELECT fr.equipment_type AS description, Sum(fwo.total_service_acres) AS Total_Acres, fr.rate, 
        SUM(fwo.total_service_acres * fr.rate ) AS Total_Amount_Acres,
        SUM(fwo.hours_worked * fr.rate ) AS Total_Amount_Hours

        FROM "Farming_Work_Order" fwo INNER JOIN "Farming_Rates" fr ON fwo.customer_id = fr.customer_id  
        ${amountWhereClause}
        WHERE fwo.customer_id = '${customer_id}' 

        GROUP BY fwo.customer_id, fr.equipment_type, fr.rate
        ;`;

        let queryToRun = `
        SELECT * FROM "Farming_Work_Order"
        WHERE customer_id = '${customer_id}' 
        ${whereClause}
        AND ("work_order_status" <> 'invoiced' OR "work_order_status" <> 'paid')
        AND is_deleted = FALSE
        ORDER BY created_at ASC;
        ;`;

        let query = `${queryToRun} ${totalAmount}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);
        console.log(result);
        
        let resp = {
            jobResults: result[0].rows,
            totalAmount: result[1].rows
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
