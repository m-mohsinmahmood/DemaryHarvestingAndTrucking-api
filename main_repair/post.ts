import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { reportEquipmentIssue, repairTicket,maintenanceTicket } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
let query = ``
  try {    
    const reportEquipmentIssue: reportEquipmentIssue = req.body;
    const repairTicket: repairTicket = req.body;
    const maintenanceTicket: maintenanceTicket = req.body;
    const entity = req.query.entity;
    let result;
    const dwr_id = req.query.dwr_id ;
    console.log('REQ:',req.body)
    console.log('ENTITY:',entity)
    if(entity === 'report-issue'){
        query = `
           INSERT INTO 
                     "Maintenance_Repair" 
                     ("empId", 
                     "equipmentId",
                     "city",
                     "state",
                     "repairTicketId",
                     "issueCategory",
                     "severityType",
                     "status",
                     "description",
                     "ticketType"
                     )
           VALUES 
                     ('${reportEquipmentIssue.empId}', 
                     '${reportEquipmentIssue.equipmentId}',
                     '${reportEquipmentIssue.city}',
                     '${reportEquipmentIssue.state}',
                      '${reportEquipmentIssue.repairTicketId}',
                      '${reportEquipmentIssue.issueCategory}',
                      '${reportEquipmentIssue.severityType}',
                      '${reportEquipmentIssue.status}',
                    $$${reportEquipmentIssue.description}$$,
                      '${reportEquipmentIssue.ticketType}'
                      );
       `;
    }
    else if(entity === 'repair'){
        query = `
        INSERT INTO 
                  "Maintenance_Repair" 
                  ("repairTicketId", 
                  "assignedById",
                  "assignedToId",
                  "equipmentId",
                  "city",
                  "state",
                  "issueCategory",
                  "severityType",
                  "status",
                  "description",
                  "ticketType",
                  "empId",
                  isassigned
                  )
        VALUES 
                  ('${repairTicket.repairTicketId}', 
                  '${repairTicket.assignedById}',
                  '${repairTicket.assignedToId}',
                  '${repairTicket.equipmentId}',
                   '${repairTicket.city}',
                   '${repairTicket.state}',
                   '${repairTicket.issueCategory}',
                   '${repairTicket.severityType}',
                   '${repairTicket.status}',
                   $$${repairTicket.description}$$,
                   '${repairTicket.ticketType}',
                   '${repairTicket.empId}',
                   'TRUE'
                   )
                   RETURNING id as record_id
                   ;

                   UPDATE 
              
                   "DWR_Employees"
                                     
                   SET 
                     "supervisor_id" = '${repairTicket.assignedById}',
                     "state" = '${repairTicket.state}'
                                          
                   WHERE 
                     "id" = '${dwr_id}';  
    `;
    }
    else if(entity === 'maintenance'){
        query = `
        INSERT INTO 
                  "Maintenance_Repair" 
                  ("repairTicketId", 
                  "assignedById",
                  "assignedToId",
                  "equipmentId",
                  "city",
                  "state",
                  "issueCategory",
                  "severityType",
                  "status",
                  "description",
                  "ticketType",
                  "empId",
                  "isassigned"
                  )
        VALUES 
                  ('${maintenanceTicket.repairTicketId}', 
                  '${maintenanceTicket.assignedById}',
                  '${maintenanceTicket.assignedToId}',
                  '${maintenanceTicket.equipmentId}',
                   '${maintenanceTicket.city}',
                   '${maintenanceTicket.state}',
                   '${maintenanceTicket.issueCategory}',
                   '${maintenanceTicket.severityType}',
                   '${maintenanceTicket.status}',
                   $$${maintenanceTicket.description}$$,
                   '${maintenanceTicket.ticketType}',
                   '${repairTicket.empId}',
                   'TRUE'
                   )
                   RETURNING id as record_id
                   ;

                   UPDATE 
              
                   "DWR_Employees"
                                     
                   SET 
                     "supervisor_id" = '${maintenanceTicket.assignedById}',
                     "state" = '${maintenanceTicket.state}'
                                          
                   WHERE 
                     "id" = '${dwr_id}';  
    `;
    }
    console.log('Query::',query)
    db.connect();
    result = await db.query(query);
    db.end();
    context.res = {
      status: 200,
      body: {
        status: 200,
        id:  result.rows[0],
        message: "Issue has beed reported",
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
    context.done();
    return;
  }
};

export default httpTrigger;
