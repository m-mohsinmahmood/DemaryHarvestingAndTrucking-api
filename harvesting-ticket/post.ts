import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { create_ticket, create_ticket_split } from "./model";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query= ``
  try {
    const create_ticket: create_ticket = req.body;
    const create_ticket_split: create_ticket_split = req.body;
if (req.body.split_load_check === true) {
     query = `
      INSERT INTO 
                  "Harvesting_Ticket" 
                  ("truck_driver_id", 
                  "destination", 
                  "loaded_miles", 
                  "field", 
                  "split_load_check",
                  "kart_scale_weight",
                  "delivery_ticket_number", 
                  "kart_operator_id", 
                  "truck_driver_company", 
                  "truck_id",
                  "split_load", 
                  "kart_scale_weight_split", 
                  "field_load_split",
                  "status",
                  "working_status",
                  "state",
                  "farm_id",
                  "crop_id",
                  "field_id",
                  "customer_id"
                  )
                  
      VALUES      ('${create_ticket_split.truck_driver_id}', 
                  '${create_ticket_split.destination}', 
                  '${create_ticket_split.loaded_miles}', 
                  '${create_ticket_split.field}', 
                  '${create_ticket_split.split_load_check}',
                  '${create_ticket_split.kart_scale_weight}', 
                  '${create_ticket_split.delivery_ticket_number}', 
                  '${create_ticket_split.kart_operator_id}',
                  '${create_ticket_split.truck_driver_company}',
                  '${create_ticket_split.truck_id}', 
                  '${create_ticket_split.split_load}', 
                  '${create_ticket_split.kart_scale_weight_split}',
                  '${create_ticket_split.field_load_split}',
                  '${create_ticket_split.status}',
                  '${create_ticket_split.working_status}',
                  '${create_ticket_split.state}',
                  '${create_ticket_split.farm_id}',
                  '${create_ticket_split.crop_id}',
                  '${create_ticket_split.field_id}',
                  '${create_ticket_split.customer_id}'

    );`;
} else {
    query = `
      INSERT INTO 
                  "Harvesting_Ticket" 
                  ("truck_driver_id", 
                  "destination", 
                  "loaded_miles", 
                  "field", 
                  "split_load_check",
                  "kart_scale_weight",
                  "delivery_ticket_number", 
                  "kart_operator_id", 
                  "truck_driver_company", 
                  "truck_id",
                  "status",
                  "working_status",
                  "state",
                  "farm_id",
                  "crop_id",
                  "field_id",
                  "customer_id"
                  )
                  
      VALUES      ('${create_ticket.truck_driver_id}', 
                  '${create_ticket.destination}', 
                  '${create_ticket.loaded_miles}', 
                  '${create_ticket.field}', 
                  '${create_ticket.split_load_check}',
                  '${create_ticket.kart_scale_weight}', 
                  '${create_ticket.delivery_ticket_number}', 
                  '${create_ticket.kart_operator_id}',
                  '${create_ticket.truck_driver_company}',
                  '${create_ticket.truck_id}',
                  '${create_ticket_split.status}',
                  '${create_ticket_split.working_status}',
                  '${create_ticket_split.state}',
                  '${create_ticket_split.farm_id}',
                  '${create_ticket_split.crop_id}',
                  '${create_ticket_split.field_id}',
                  '${create_ticket_split.customer_id}'

    );`;
}

    console.log(query);
    
    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Ticket has been created successfully",
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
