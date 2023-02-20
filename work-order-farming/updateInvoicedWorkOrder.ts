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

        let query = ``;

        // If user make a call from Verify Work Order of Dispatcher
        console.log("Updating Work Order for Invoice");

        query = `
                UPDATE "Farming_Work_Order"

				SET    
                work_order_status = 'invoiced',
				invoice_id = '',
                modified_at = now()
							 
				WHERE customer_id = '${workOrder.customerId}'
				AND created_at::"date" BETWEEN '${workOrder.from}' AND '${workOrder.to}' 
				AND service = '${workOrder.serviceType}'
				AND ("work_order_status" <> 'invoiced' OR "work_order_status" <> 'paid')
				AND is_deleted = FALSE
                ;`

        db.connect();
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
