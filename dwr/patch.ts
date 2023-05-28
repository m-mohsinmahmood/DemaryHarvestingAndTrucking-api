import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";
import { updateDWR } from "../utilities/dwr_functions";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const closingOfDay: beginningOfDay = req.body;

        let query = updateDWR(closingOfDay);
        await db.connect();

        let taskId = await db.query(query);

        let bridgeDailyTasksDwr = ``;
        if (closingOfDay.module === 'farming' || closingOfDay.module === 'harvesting' || closingOfDay.module === 'trucking') {
            taskId = taskId.rows[0].id;
            console.log("task Id: ", taskId);

            bridgeDailyTasksDwr = ` 
            INSERT INTO 
            "Bridge_DailyTasks_DWR" 
            (
             "dwr_id",
             "task_id"
            )

            VALUES      
            
            ('${closingOfDay.dwrId}',
            '${taskId}'
            );`;

            console.log(bridgeDailyTasksDwr);
            
            let result = await db.query(bridgeDailyTasksDwr);
        }

        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Close Out Work Order has been updated successfully.",
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
