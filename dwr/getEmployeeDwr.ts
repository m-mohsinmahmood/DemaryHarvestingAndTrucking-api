import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { GetFarmingDwr } from "./getFarmingDWR";
import { GetTrainingDwr } from "./getTrainingDwr";
import { GetTruckingDwr } from "./getTruckingDwr";
import { GetMaintenanceRepairDwr } from "./getMaintenanceRepairDwr";

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
        const module: string = req.query.dwr_type
        const type: string = req.query.type
        // const employee_id: string = req.query.employee_id

        const trainingDwr = GetTrainingDwr(employee_id, date, dateType, month, year, role, req.query.operation, taskId, module, type);
        const farmingDwr = GetFarmingDwr(employee_id, date, dateType, month, year, role, req.query.operation, taskId, module, type);
        const maintenanceDwr = GetMaintenanceRepairDwr(employee_id, date, dateType, month, year, role, req.query.operation, taskId, module, type);

        // const truckingDwr = GetTruckingDwr(employee_id, date, dateType, month, year, role);
        // const truckingDwr = GetTruckingDwr(employee_id, date, dateType, month, year, role);

        let query = ``;
        let result;

        let resp;
        if (req.query.operation === 'getDWRToVerify') {

            query = `${trainingDwr} ${farmingDwr} ${maintenanceDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            let merged = result[0].rows.concat(result[1].rows);

            const totals = Object.values(merged.reduce((acc, curr) => {
                const key = curr.employee_id;
                const employee_name = curr.employee_name;
                if (!acc[key]) {
                    acc[key] = {
                        employee_Id: key,
                        total_hours: 0,
                        employee_name: employee_name
                    }
                }
                acc[key].total_hours += +curr.total_hours
                return acc
            }, {}))

            const dwr = Object.values(merged.reduce((acc, curr) => {
                const key = curr.employee_id;
                if (!acc[key]) {
                    acc[key] = {
                        key: [curr]
                    }
                }
                acc[key].total_hours += curr.total_hours,
                acc[key].module = curr.module
                return acc
            }, {}))

            console.log(dwr);

            resp = {
                dwrSummary: totals,
                // dwr: merged,
                test: dwr
            };
        }
        if (req.query.operation === 'getDWR') {

            query = `${trainingDwr} ${farmingDwr} ${maintenanceDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            resp = {
                // farming: result[0].rows,
                // trucking: result[1].rows
                // training: result[0].rows
                trainingData: result[0].rows,
                traineeData: result[1].rows,
                trainerData: result[2].rows,
                farmingData: result[3].rows,
                maintenanceRepairData: result[4].rows
            };
        }
        else if (req.query.operation === 'getTasks') {
            if (trainingDwr !== ``)
                query = `${trainingDwr}`;
            else if (farmingDwr !== ``)
                query = `${farmingDwr}`;
            else if (maintenanceDwr !== ``)
                query = `${maintenanceDwr}`;

            db.connect();
            console.log(query);
            result = await db.query(query);

            resp = {
                tasks: result.rows
            };
        }

        else if (req.query.operation === 'getTicketData') {
            if (trainingDwr !== ``)
                query = `${trainingDwr}`;
            if (farmingDwr !== ``)
                query = `${farmingDwr}`;
            if (maintenanceDwr !== ``)
                query = `${maintenanceDwr}`;

            db.connect();
            console.log(query);
            result = await db.query(query);

            console.log(result);

            if (trainingDwr !== ``) {
                resp = {
                    trainingData: result[0].rows,
                    traineeData: result[1].rows,
                    trainerData: result[2].rows
                };
            } else {
                resp = {
                    data: result.rows
                };
            }
        }

        console.log(resp);

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

