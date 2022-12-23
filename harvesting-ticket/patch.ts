import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { rawListeners } from "process";
import { config } from "../services/database/database.config";
import { ticket_update,ticket_update_kart } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query =``;
  try {
    const ticket_update: ticket_update = req.body;
    const ticket_update_kart: ticket_update_kart = req.body;
    const ticket_id: any = req.query.ticket_id;

    if (ticket_update.status === 'pending') {
        query = `
            UPDATE 
                    "Harvesting_Ticket"
            SET 
                   "scale_ticket"                    = '${ticket_update.scale_ticket}', 
                   "scale_ticket_weight"                    = '${ticket_update.scale_ticket_weight}',
                    "test_weight"                     = '${ticket_update.test_weight}',
                    "protein_content"                     = '${ticket_update.protein_content}',
                    "moisture_content"                     = '${ticket_update.moisture_content}',
                    "status"                     = '${ticket_update.status}'
    
            WHERE 
                    "delivery_ticket_number" = '${ticket_id}';`
        
    } else {
        query = `
            UPDATE 
                    "Harvesting_Ticket"
            SET 
                    "status"                     = '${ticket_update_kart}'
    
            WHERE 
                    "delivery_ticket_number" = '${ticket_id}';`
    }

                db.connect();
                let result = await db.query(query);
                db.end();
            
                context.res = {
                  status: 200,
                  body: {
                    message: "Ticket has been updated successfully.",
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
            