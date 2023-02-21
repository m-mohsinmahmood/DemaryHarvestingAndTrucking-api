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
        SELECT fw.created_at AS date, fw.service,  farm."name" AS farm, field."name" AS field, fw.total_service_acres AS acres,
        fw.beginning_engine_hours, fw.ending_engine_hours, fw.work_order_status
        
        FROM "Farming_Work_Order" fw
         
        INNER JOIN "Customer_Farm" farm ON fw.farm_id = farm.id
        INNER JOIN "Customer_Field" field ON fw.field_id = field."id"
         
         
        WHERE fw.customer_id = '15e77518-26bd-488f-93db-25cd1f726680' 
        ${whereClause}
        AND fw.work_order_status = 'verified'
        AND fw.is_deleted = FALSE
        ORDER BY fw.created_at ASC;
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
