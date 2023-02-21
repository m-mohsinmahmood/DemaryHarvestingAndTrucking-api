import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { InvoicedWorkOrder } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const workOrder: InvoicedWorkOrder = req.body;

        let whereClause = ``;
        if (workOrder.from) whereClause = ` ${whereClause}  AND '${workOrder.from}' <= created_at::"date"`;
        if (workOrder.to) whereClause = ` ${whereClause}  AND '${workOrder.to}' >= created_at::"date"`;
        if (workOrder.serviceType) whereClause = ` ${whereClause}  AND service = '${workOrder.serviceType}'`;
        if (workOrder.quantityType) whereClause = ` ${whereClause}  AND quantity_type = '${workOrder.quantityType}'`;

        let insertquery = `
            INSERT INTO 
                        "Farming_Invoice" 
                        ("customer_id", 
                        "equipment_type", 
                        "quantity_type", 
                        "quantity",
                        "rate", 
                        "amount",
                        "field_id" 
                      )

            VALUES      ('${workOrder.customerId}', 
                        '${workOrder.serviceType}', 
                        '${workOrder.quantityType}', 
                        '${workOrder.quantity}', 
                        '${workOrder.rate}',
                        '${workOrder.amount}', 
                        '${workOrder.fieldId}' 
                       ) returning id;
          `;

        db.connect();
        // console.log(insertquery);

        let invoice = await db.query(insertquery);
        invoice = invoice.rows[0].id;
        console.log("Invoice: ", invoice);


        // If user make a call from Verify Work Order of Dispatcher
        console.log("Updating Work Order for Invoice");

        let query = `
                UPDATE "Farming_Work_Order"

				SET    
                work_order_status = 'invoiced',
				invoice_id = '${invoice}',
                modified_at = now()
							 
				WHERE customer_id = '${workOrder.customerId}'
                ${whereClause}
				AND ("work_order_status" <> 'invoiced' OR "work_order_status" <> 'paid')
				AND is_deleted = FALSE
                ;`

        console.log(query);

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Work Order has been updated successfully.",
                status: 200
            },
        };
        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
