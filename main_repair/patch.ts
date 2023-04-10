import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { rawListeners } from "process";
import { config } from "../services/database/database.config";
import { assignTicket,completeTicket } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query = ``;
  try {
    const assignTicket: assignTicket = req.body;
    const completeTicket: completeTicket = req.body;
    const ticketRecordId: any = req.query.ticketRecordId;
    const entity: any = req.query.entity;
    console.log("REQ::", req.body);
    console.log("entity::", entity);
    if (entity === "unassign") {
      query = `
            UPDATE 
                    "Maintenance_Repair"
            SET 
                   "empModule"                    = '${assignTicket.empModule}', 
                   "assignedById"                    = '${assignTicket.assignedById}',
                    "assignedToId"                     = '${assignTicket.assignedToId}',
                    "summary"                     = '${assignTicket.summary}',
                    "isassigned" = TRUE
            WHERE 
                    "id" = '${ticketRecordId}';`;
    }
    else if(entity === "complete"){
      const dwr_id = req.query.dwr_id ;
      query = `
      UPDATE 
              "Maintenance_Repair"
      SET 
              "summary"                     =  $$${completeTicket.summary}$$,
              "iscompleted" = TRUE,
              "initialy_created" = TRUE,
              "iscontinue" = FALSE,
              "completedat" = 'now()'

      WHERE 
              "id" = '${ticketRecordId}';
              
              UPDATE 
              
              "DWR_Employees"
                                
              SET 
                "supervisor_id" = '${completeTicket.assignedById}',
                "state" = '${completeTicket.state}'
                                     
              WHERE 
                "id" = '${dwr_id}'  

                UPDATE 
              
                "DWR"
                                  
                SET 
                  "taskType" = 'work done'
                                       
                WHERE 
                  main_repair_ticket_id = '${ticketRecordId}'
              `;
    }
    else if(entity === "continue"){
      query = `
      UPDATE 
              "Maintenance_Repair"
      SET 
              "summary"                     =  $$${completeTicket.summary}$$,
              "iscontinue" = TRUE

      WHERE 
              "id" = '${ticketRecordId}';`;
    }

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
