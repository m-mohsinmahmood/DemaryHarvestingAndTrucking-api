import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { GetFarmingDwr } from "./getFarmingDWR";
import { GetTrainingDwr } from "./getTrainingDwr";
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
        const taskId: string = req.query.taskId

        // const farmingDwr = GetFarmingDwr(employee_id, date, dateType, month, year, role);
        // const truckingDwr = GetTruckingDwr(employee_id, date, dateType, month, year, role);
        const trainingDwr = GetTrainingDwr(employee_id, date, dateType, month, year, role, req.query.operation, taskId);

        let query = ``;
        let result;

        let resp;
        if (req.query.operation === 'getDWR') {

            query = `${trainingDwr} ${trainingDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            resp = {
                // farming: result[0].rows,
                // trucking: result[1].rows
                // training: result[0].rows
                trainingData: result[0].rows,
                traineeData: result[1].rows
            };
        }
        else if (req.query.operation === 'getTasks') {
            if (trainingDwr != ``)
                query = `${trainingDwr}`;

            db.connect();
            console.log(query);
            result = await db.query(query);

            resp = {
                tasks: result.rows
            };
        }

        else if (req.query.operation === 'getTicketData') {
            if (trainingDwr != ``)
                query = `${trainingDwr}`;

            db.connect();
            console.log(query);
            result = await db.query(query);

            resp = {
                trainingData: result[0].rows,
                traineeData: result[1].rows
            };
        }


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

