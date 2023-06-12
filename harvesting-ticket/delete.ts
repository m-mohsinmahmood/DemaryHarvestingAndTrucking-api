import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const ticket_id: string = req.body.id;
    let query = `
    UPDATE 
      "Harvesting_Delivery_Ticket" 
  
    SET 
      "is_deleted"  = TRUE   
  
    WHERE 
      id = '${ticket_id}';
    `;

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        status: 200,
        message: "Ticket has been deleted successfully.",
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
