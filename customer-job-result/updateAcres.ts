import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { job_update, job_close } from "../customer-job-setup/model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    let query = ``;
    try {
        const id = req.body.acreData.id;
        const acres = req.body.acreData.acres;
        const loadDate = req.body.acreData.load_date;
        const scaleTicket = req.body.acreData.sl_number;
        const netPounds = req.body.acreData.net_pounds;
        const netBushels = req.body.acreData.net_bushel;
        const loadMiles = req.body.acreData.load_miles;
        const status = req.body.acreData.status;
        const crop_id = req.body.acreData.crop_id;
        const ticket_name = req.body.acreData.ticket_name;
        const field_id = req.body.acreData.field_id;
        const destination_id = req.body.acreData.destination_id.id;

        let query: string = ``;

        if (acres != null) {
            query = `
            ${query}
            UPDATE 
            "Customer_Job_Setup"
            
            SET 
           "crop_acres" = '${acres}' 
            
           WHERE 
            "id" = '${id}';
            `
        }

        if (field_id != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "field_id" = '${field_id}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        if (loadDate != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "created_at" = '${loadDate}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        if (destination_id != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "destination_id" = '${destination_id}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        if (scaleTicket != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "scale_ticket_number" = '${scaleTicket}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        if (netPounds != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "scale_ticket_weight" = '${netPounds}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        if (netBushels != null) {
            query = `
            ${query}
            UPDATE 
            "Crops"
            
            SET 
           "bushel_weight" = '${netBushels}' 
            
           WHERE 
            "id" = '${crop_id}';
            `
        }

        if (loadMiles != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "loaded_miles" = '${loadMiles}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        if (status != null) {
            query = `
            ${query}
            UPDATE 
            "Harvesting_Delivery_Ticket"
            
            SET 
           "ticket_status" = '${status}' 
            
           WHERE 
            "delivery_ticket_name" = '${ticket_name}';
            `
        }

        console.log('Query:', query)
        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Job has been updated successfully.",
                status: 200,
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
