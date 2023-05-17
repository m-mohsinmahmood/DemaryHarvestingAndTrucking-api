import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const data: beginningOfDay = req.body;
        const dateType: string = req.query.dateType;
        const month: string = req.query.month;
        const year: string = req.query.year;
        const startDate: string = req.query.startDate;
        const endDate: string = req.query.endDate;

        let where = ``;
        db.connect();

        if (dateType === 'month') {
            where = `${where} AND EXTRACT(MONTH FROM begining_day) = '${month}'`
            where = `${where} AND EXTRACT(YEAR FROM begining_day) = '${year}'`
        }
        else {
            where = `${where} AND begining_day > '${startDate}'::timestamp AND begining_day < '${endDate}'::timestamp`
        }

        let query = ` 
        UPDATE 
        "DWR_Employees"
        
        SET 
        "dwr_status" = 'verified',
        "modified_at" = CURRENT_TIMESTAMP

        where 
                        
        is_active = FALSE
        ${where}
        AND employee_id = '${data.employeeId}'
        AND dwr_status = 'pendingVerification'
            ;`;

        let result = await db.query(query);

        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Dwr has been updated successfully.",
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
