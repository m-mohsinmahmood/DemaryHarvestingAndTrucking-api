import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const order: beginningOfDay = req.body;

        let optionalReq: string = ``;
        let optionalValues: string = ``;

        if (order.machineryId != null) {
            optionalReq = `${optionalReq},"machinery_id"`;
            optionalValues = `${optionalValues},'${order.machineryId}'`
        }

        if (order.beginningEngineHours != null) {
            optionalReq = `${optionalReq},"beginning_engine_hours"`;
            optionalValues = `${optionalValues},'${order.beginningEngineHours}'`
        }

        let query = ``;

        query = `
            INSERT INTO 
                        "DWR" 
                        ("employee_id"
                        ${optionalReq})
      
            VALUES      ('${order.employeeId}'
                        ${optionalValues});
          `;

        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
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
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
