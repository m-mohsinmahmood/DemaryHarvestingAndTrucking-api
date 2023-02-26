import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { PaidWorkOrder } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const workOrder: PaidWorkOrder = req.body;
        const invoice_id = req.body.invoice_id

        let query = ``;

        // If user make a call from Verify Work Order of Dispatcher
        console.log("Updating Work Order for Invoice");

        query = `
        UPDATE "Farming_Invoice" 
				
        SET    
        status = 'paid',
        updated_at = now()
        
        WHERE id= '${invoice_id}'  
        AND customer_id = '${workOrder.customerId}' 
        AND ("status" = 'invoiced') 
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
