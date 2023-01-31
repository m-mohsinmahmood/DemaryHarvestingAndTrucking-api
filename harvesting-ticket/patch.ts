import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
// import { ticket_update, ticket_update_kart, ticket_reassign } from "./model";
import { UpdateHarvestingTicket } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query = ``;
  try {
    const ticket_update: UpdateHarvestingTicket = req.body;
    console.log('REQ:', req.body);

    if (ticket_update.operation === 'verifyTicket') {
      query = `
            UPDATE 
                    "Harvesting_Delivery_Ticket"
            SET 
                    "ticket_status"                     = 'verified'
            WHERE 
                    "id" = '${ticket_update.ticketId}';`

    }

    else if (ticket_update.operation === 'completeTicket') {
      let optionalReq: string = ``;

      if (ticket_update.fieldId != null) {
        optionalReq = `${optionalReq},"field_id" = '${ticket_update.fieldId}'`;
      }

      if (ticket_update.destination != null) {
        optionalReq = `${optionalReq},"destination" = '${ticket_update.destination}'`;
      }

      if (ticket_update.farmId != null) {
        optionalReq = `${optionalReq},"farm_id" = '${ticket_update.farmId}'`;
      }

      if (ticket_update.cropName != null) {
        optionalReq = `${optionalReq},"crop" = '${ticket_update.cropName}'`;
      }

      if (ticket_update.scaleTicketWeight != null) {
        optionalReq = `${optionalReq},"scale_ticket_weight" = '${ticket_update.scaleTicketWeight}'`;
      }

      if (ticket_update.testWeight != null) {
        optionalReq = `${optionalReq},"test_weight" = '${ticket_update.testWeight}'`;
      }

      if (ticket_update.proteinContent != null) {
        optionalReq = `${optionalReq},"protein_content" = '${ticket_update.proteinContent}'`;
      }

      if (ticket_update.moistureContent != null) {
        optionalReq = `${optionalReq},"moisture_content" = '${ticket_update.moistureContent}'`;
      }

      query = `
      UPDATE 
          "Harvesting_Delivery_Ticket"
      SET 
          "ticket_status" = 'verified'
           ${optionalReq}
      WHERE 
          "id" = '${ticket_update.ticketId}' ;`
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
