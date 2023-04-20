import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { GetFarmingDwr } from "./getFarmingDWR";
import { GetTrainingDwr } from "./getTrainingDwr";
import { GetMaintenanceRepairDwr } from "./getMaintenanceRepairDwr";
import { GetOtherDwr } from "./getOtherDWR";

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
        const status: string = req.query.status
        const operation: string = req.query.operation

        const farmingDwr = GetFarmingDwr(employee_id, date, dateType, month, year, operation, status);
        const maintenanceDwr = GetMaintenanceRepairDwr(employee_id, date, dateType, month, year, operation, status);
        const otherDwr = GetOtherDwr(employee_id, date, dateType, month, year, operation, status);
        const trainingDwr = GetTrainingDwr(employee_id, date, dateType, month, year, operation, status);

        let query = ``;
        let result;

        let resp;
        if (req.query.operation === 'getDWRToVerify') {
            query = `${farmingDwr} ${maintenanceDwr} ${otherDwr} ${trainingDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            // For merging of training results from 3 different tables
            let mergedTraining = [...result[3].rows, ...result[4].rows, ...result[5].rows];
            let mergedResults = result[0].rows.concat(result[1].rows, result[2].rows, mergedTraining);

            const totals = Object.values(mergedResults.reduce((acc, curr) => {
                const key = curr.employee_id;
                const employee_name = curr.employee_name;
                const supervisor_id = curr.supervisor_id;
                const last_supervisor_id = curr.last_supervisor_id;

                console.log(curr);
                console.log(acc);

                if (!acc[key]) {
                    acc[key] = {
                        employee_Id: key,
                        total_hours: 0,
                        employee_name: employee_name,
                        supervisor_id: supervisor_id,
                        last_supervisor_id: last_supervisor_id,
                    }
                }
                acc[key].total_hours += +curr.total_hours
                return acc
            }, {}))


            resp = {
                dwrSummary: totals
            };
        }

        if (req.query.operation === 'getDWRDetails') {

            query = `${farmingDwr} ${maintenanceDwr}  ${otherDwr} ${trainingDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            let mergedTraining = [...result[3].rows, ...result[4].rows, ...result[5].rows];
            let merged = result[0].rows.concat(result[1].rows, result[2].rows, mergedTraining);

            resp = {
                dwr: merged
            };
        }

        if (req.query.operation === 'getDWRList') {

            query = `${farmingDwr} ${maintenanceDwr}  ${otherDwr} ${trainingDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            let mergedTraining = [...result[3].rows, ...result[4].rows, ...result[5].rows];
            let merged = result[0].rows.concat(result[1].rows, result[2].rows, mergedTraining);

            resp = {
                dwr: merged
            };
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

