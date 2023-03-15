import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { GetFarmingDwr } from "./getFarmingDWR";
import { GetTruckingDwr } from "./getTruckingDwr";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const employee_id: string = req.query.employeeId;
        const date: string = req.query.date;
        const dateType: string = req.query.dateType;
        const month: string = req.query.month;
        const year: string = req.query.year;
        const role: string = req.query.role

        console.log("Getting DWR of employees");

        const farmingDwr = GetFarmingDwr(employee_id, date, dateType, month, year, role);
        const truckingDwr = GetTruckingDwr(employee_id, date, dateType, month, year, role);

        let query = `${farmingDwr} ${truckingDwr}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);
        
        let resp = {
            farming: result[0].rows,
            trucking: result[1].rows
        };

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

