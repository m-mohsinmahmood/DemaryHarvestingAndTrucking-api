import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { GetFarmingDwr } from "./getFarmingDWR";
import { GetTrainingDwr } from "./getTrainingDwr";
import { GetMaintenanceRepairDwr } from "./getMaintenanceRepairDwr";
import { GetOtherDwr } from "./getOtherDWR";
import { log } from "console";
const fs = require('fs');

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
            console.log("Query:...", query);

            // const filePath = 'query_test.txt';

            // await fs.writeFile(filePath, query, (err) => {
            //     if (err) {
            //         context.log.error(`Error writing data to file: ${err}`);

            //     } else {
            //         context.log(`Data written to file: ${query}`);
            //     }
            // })

            db.connect();
            result = await db.query(query);

            // For merging of training results from 3 different tables
            let mergedTraining = [...result[3].rows, ...result[4].rows, ...result[5].rows];
            // let mergedResults = result[0].rows.concat(result[1].rows, result[2].rows, mergedTraining);
            let mergedResults = mergedTraining;

            const totals = Object.values(mergedResults.reduce((acc, curr) => {
                const key = curr.employee_id;
                const employee_name = curr.employee_name;
                const supervisor_id = curr.supervisor_id;
                const last_supervisor_id = curr.last_supervisor_id;

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
                dwrSummary: totals,
                test_0: result[3].rows,
                test_1: result[4].rows,
                test_2: result[5].rows
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

