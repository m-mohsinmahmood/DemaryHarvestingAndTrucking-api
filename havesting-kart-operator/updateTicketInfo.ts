import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { rawListeners } from "process";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query = ``;
  try {
    const net_weight: string= req.body.net_weight;
    const moisture_content: string= req.body.moisture_content;
    const protein_content: string= req.body.protein_content;
    const test_weight: string=req.body.test_weight;
    const scale_ticket: string=req.body.scale_ticket;
    const operation: string = req.body.operation;
    const ticket_id: string = req.body.ticket_id;



      const dwr_id = req.query.dwr_id ;
      query = `
            UPDATE 
                    "Harvesting_Delivery_Ticket"
            SET 
                   "test_weight"                    = '${test_weight}', 
                   "moisture_content"                    = '${moisture_content}',
                    "protein_content"                     = '${protein_content}',
                    "scale_ticket_weight"                     = '${net_weight}', 
                    "delivery_ticket_number"                     = '${scale_ticket}'  
            WHERE 
                    "id" = '${ticket_id}';

                    `;
    

    db.connect();
    console.log(query);
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
