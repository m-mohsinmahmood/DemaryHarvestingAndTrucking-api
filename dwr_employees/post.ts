import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { dwr } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const dwr: dwr = req.body;

        let query = `
            INSERT INTO 
                        "DWR_Employees" 
                        ("employee_id", 
                        "role",
                        "module", 
                        "is_active" 
                        )
      
            VALUES      ('${dwr.employeeId}', 
                        '${dwr.role}', 
                        '${dwr.module}', 
                        'TRUE'
                        )
          ;`;

        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "DWR has been created successfully",
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
