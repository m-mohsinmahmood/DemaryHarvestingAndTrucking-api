import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const entity = req.query.entity;
  const employee_id = req.query.employee_id;
  const ticket_record_id = req.query.ticket_record_id;
  const ticketType = req.query.ticketType;
  console.log('Entity:',entity)

  let query = ``;
  try {
        // to get employee details
    if (entity === "getEmployeeById") {
      query = `
            SELECT 
          concat(emp.first_name,' ' ,emp.last_name)	as "employee_name",
          emp."id" as "employee_id"
          FROM 
                "Employees" emp
          WHERE 
                "id" = '${employee_id}'
            ;`;
    }
    // to get unassignedtickets ticket
    else if (entity === "unassignedTickets") {
        query = `
              SELECT 
            *
            FROM 
                  "Maintenance_Repair"
            WHERE 
                  "empId" = '${employee_id}' AND "isassigned" = FALSE
              ;`;
      }
      // to get repair & maintenance ticket
      else if (entity === "repair" || entity === "maintenance") {
        query = `
              SELECT 
            *
            FROM 
                  "Maintenance_Repair"
            WHERE 
                  "assignedToId" = '${employee_id}' AND "ticketType" = '${entity}' AND "isassigned" = TRUE AND "iscompleted" = FALSE AND "iscontinue" = FALSE
              ;`;
      }
      // to get the assigned ticket record
      else if (entity === "assignedTicketRecord") {
        query = `
        SELECT 
        mr."repairTicketId" as "repairTicketId",
        mr."equipmentId" as "equipmentId",
        mr."city" as "city",
        mr."state" as "state",
        mr."issueCategory" as "issueCategory",
        mr."severityType" as "severityType",
        mr."status" as "status",
        mr."summary" as "summary",
        mr."description" as "description",
        mr."empModule" as "empModule",
        mr."assignedById" as "assignedById",
        mr."assignedToId" as "assignedToId",
        concat(emp.first_name, ' ', emp.last_name) as "assignedBy",
        concat(emp2.first_name, ' ', emp2.last_name) as "assignedTo"
      
        FROM 
        "Maintenance_Repair" mr
              
        INNER JOIN "Employees" emp
        on mr."assignedById" = emp."id"
              
        INNER JOIN "Employees" emp2
        on mr."assignedToId" = emp2."id"
        WHERE 
        mr."id"='${ticket_record_id}'
          ;`;
      }
      // to get the un-assigned ticket record
      else if (entity === "unassignedTicketRecord") {
        query = `
        SELECT 
        *
        FROM "Maintenance_Repair"
        WHERE 
        "id"='${ticket_record_id}'
          ;`;
      }
    // to get the continued tickets (repair & maintenance) record
      else if (entity === "continuedTickets") {
        query = `
        SELECT 
        *
        FROM "Maintenance_Repair"
        WHERE 
        "assignedToId" = '${employee_id}' AND "ticketType" = '${ticketType}' AND "isassigned" = TRUE AND "iscompleted" = FALSE AND "iscontinue" = TRUE
        ;`;
      }
    // to get the continued ticket record
      else if (entity === "continuedTicket") {
        query = `
        SELECT 
        mr."repairTicketId" as "repairTicketId",
        mr."equipmentId" as "equipmentId",
        mr."city" as "city",
        mr."state" as "state",
        mr."issueCategory" as "issueCategory",
        mr."severityType" as "severityType",
        mr."status" as "status",
        mr."summary" as "summary",
        mr."description" as "description",
        mr."empModule" as "empModule",
        mr."assignedById" as "assignedById",
        mr."assignedToId" as "assignedToId",
        concat(emp.first_name, ' ', emp.last_name) as "assignedBy",
        concat(emp2.first_name, ' ', emp2.last_name) as "assignedTo"
      
        FROM 
        "Maintenance_Repair" mr
              
        INNER JOIN "Employees" emp
        on mr."assignedById" = emp."id"
              
        INNER JOIN "Employees" emp2
        on mr."assignedToId" = emp2."id"
        WHERE 
        mr."id"='${ticket_record_id}'
          ;`;
      }
    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp;
    resp = result.rows;

    db.end();

    context.res = {
      status: 200,
      body: resp,
    };

    context.done();
    return;
  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    context.done();
    return;
  }
};

export default httpTrigger;
