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
        const { invoice, total_amount, filters } = req.body;

        console.log(req.body);

        let whereClause = ``;
        if (filters.date_period_start) whereClause = ` ${whereClause}  AND '${filters.date_period_start}' <= created_at::"date"`;
        if (filters.date_period_end) whereClause = ` ${whereClause}  AND '${filters.date_period_end}' >= created_at::"date"`;
        if (filters.service_type) whereClause = ` ${whereClause}  AND service = '${filters.service_type}'`;
        if (filters.quantity_type) whereClause = ` ${whereClause}  AND quantity_type = '${filters.quantity_type}'`;

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
                        '${filters.service_type}', 
                        '${filters.quantity_type}', 
                        '${workOrder.quantity}', 
                        '${workOrder.rate}',
                        '${workOrder.amount}', 
                        '${workOrder.fieldId}' 
                       ) returning id;
          `;

        db.connect();
        // console.log(insertquery);

        let invoiceId = await db.query(insertquery);
        invoiceId = invoiceId.rows[0].id;
        console.log("Invoice: ", invoiceId);

        let farmingInvoiceRecords = ``;

        invoice.forEach(element => {
            console.log("test 1: ", element);
            farmingInvoiceRecords = `
            INSERT INTO 
                        "Farming_Invoice_Records" 
                        ("equipment", 
                        "rate", 
                        "quantity", 
                        "amount",
                        "farming_invoice_id"
                      )

            VALUES      ('${element.description}', 
                        '${element.rate}', 
                        '${element.quantity}', 
                        '${element.total_amount}', 
                        '${invoiceId}'
                       );
          `;
        });

        let resultOfRecords = await db.query(farmingInvoiceRecords);

        // If user make a call from Verify Work Order of Dispatcher
        console.log("Updating Work Order for Invoice");

        let query = `
                UPDATE "Farming_Work_Order"

				SET    
                work_order_status = 'invoiced',
				invoice_id = '${invoiceId}',
                modified_at = now()
							 
				WHERE customer_id = '${workOrder.customerId}'
                ${whereClause}
                AND "work_order_status" = 'verified'
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
