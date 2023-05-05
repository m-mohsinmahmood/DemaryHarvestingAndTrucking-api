import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { GetFarmingDwr } from "./getFarmingDWR";
import { GetTrainingDwr } from "./getTrainingDwr";
import { GetMaintenanceRepairDwr } from "./getMaintenanceRepairDwr";
import { GetOtherDwr } from "./getOtherDWR";
const fs = require('fs');

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const employee_id: string = req.query.employeeId;
        const startDate: string = req.query.startDate;
        const endDate: string = req.query.endDate;
        const dateType: string = req.query.dateType;
        const month: string = req.query.month;
        const year: string = req.query.year;
        const status: string = req.query.status
        const operation: string = req.query.operation

        const farmingDwr = GetFarmingDwr(employee_id, startDate, endDate, dateType, month, year, operation, status);
        const maintenanceDwr = GetMaintenanceRepairDwr(employee_id, startDate, endDate, dateType, month, year, operation, status);
        const otherDwr = GetOtherDwr(employee_id, startDate, endDate, dateType, month, year, operation, status);
        const trainingDwr = GetTrainingDwr(employee_id, startDate, endDate, dateType, month, year, operation, status);

        let query = ``;
        let result;

        let resp;

        if (req.query.operation === 'getDWRToVerify') {
            query = `${farmingDwr} ${maintenanceDwr} ${otherDwr} ${trainingDwr}`;

            db.connect();

            result = await db.query(query);

            // For merging of training results from 3 different tables
            let mergedTraining = [...result[3].rows, ...result[4].rows, ...result[5].rows];
            let mergedResults = result[0].rows.concat(result[1].rows, result[2].rows, mergedTraining);


            const totals = Object.values(mergedResults.reduce((acc, curr) => {
                const key = curr.employee_id;
                // const supervisor_id = curr.supervisor_id;

                if (!acc[key]) {
                    acc[key] = {
                        employee_Id: key,
                        total_hours: 0,
                        employee_name: curr.employee_name,
                        // supervisor_id: supervisor_id,
                        last_supervisor_id: curr.last_supervisor_id,
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

            const filePath = 'query_test.txt';
            try {
                await fs.promises.writeFile(filePath, query);
                context.log(`Data written to file`);
            }
            catch (err) {
                context.log.error(`Error writing data to file: ${err}`);
            }

            result = await db.query(query);

            let mergedTraining = [...result[3].rows, ...result[4].rows, ...result[5].rows];
            let merged = result[0].rows.concat(result[1].rows, result[2].rows, mergedTraining);

            const groupedData = Object.values(merged.reduce((acc, obj) => {
                const key = obj.id;
                if (!acc[key]) {
                    acc[key] = {
                        id: key,
                        login_time: obj.login_time,
                        logout_time: obj.logout_time,
                        total_hours: 0,
                        module: obj.module,
                        supervisor_notes: obj.supervisor_notes,
                        employee_notes: obj.employee_notes,
                        tickets: obj.tickets
                    }
                }
                // else {
                //     acc[key].push(obj);
                // }
                acc[key].total_hours += +obj.total_hours
                
                return acc;
            }, {}));

            resp = {
                dwr: groupedData
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

