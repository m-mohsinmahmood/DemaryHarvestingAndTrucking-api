import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { Data } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const data: Data = req.body;
        console.log(data);

        let query = ``;

        query = `
            INSERT INTO 
                        "Other" 
                        ("employee_id", 
                         "supervisor_id",
                         "state",
                         "category",
                         "description"
                        )
      
            VALUES      ('${data.employee_id}', 
                        '${data.supervisor_id}', 
                        '${data.state}', 
                        '${data.module}', 
                        '${data.notes_other}'
                         );


            UPDATE 
            "DWR_Employees"
                    
            SET 
            "state" = '${data.state}'
                         
            WHERE 
            "id" = '${data.active_check_in_id}' ;
          `;

        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Otder Data has been created successfully",
            },
        };

        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                status: 500,
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
