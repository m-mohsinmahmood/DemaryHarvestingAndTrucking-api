import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { dwr, editDWR } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const dwr: editDWR = req.body;
        let query = ``;

        if (req.body.operation == 'editDwr') {
            query = `
            UPDATE 
            "DWR_Employees"
       
            SET 
            "employee_id"       = '${dwr.employeeId}',
            "begining_day"      = '${dwr.begining_day}',
            "ending_day"        = '${dwr.ending_day}',
            "state"             = '${dwr.state}',
            "dwr_status"        = '${dwr.status}',
            "supervisor_id"     = '${dwr.supervisorId}',
            "modified_at"       = CURRENT_TIMESTAMP
            
            WHERE 
            "id" = '${dwr.id}' ;`;
        }

        else {
            const dwr: dwr = req.body;
            query = `
        UPDATE 
        "DWR_Employees"
   
        SET 
        "is_active"     = FALSE,
        "dwr_status"    = 'pendingVerification',
        "modified_at"   = CURRENT_TIMESTAMP,
        "ending_day"    = CURRENT_TIMESTAMP
        
        WHERE 
        "id" = '${dwr.id}' ;`;

        }

        console.log(query);

        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "DWR has been updated successfully.",
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
