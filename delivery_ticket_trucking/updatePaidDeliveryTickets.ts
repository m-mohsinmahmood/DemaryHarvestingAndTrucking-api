import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const customer_id = req.body.customerId;;

        let query = ``;

        // If user make a call from Verify Work Order of Dispatcher
        console.log("Updating Trucking_Delivery_Ticket for Invoice");

        query = `
        UPDATE "Trucking_Delivery_Ticket" 
				
        SET    
        ticket_status = 'paid',
        modified_at = now()
        
        WHERE invoice_id= ''  
        AND customer_id = '${customer_id}' 
        AND ("ticket_status" = 'invoiced') 
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
