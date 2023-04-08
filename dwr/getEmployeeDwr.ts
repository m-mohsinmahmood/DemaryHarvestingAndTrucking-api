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
        const role: string = req.query.role
        const taskId: string = req.query.taskId
        const module: string = req.query.dwr_type
        const type: string = req.query.type
        const status: string = req.query.status
        const operation: string = req.query.operation

        // const trainingDwr = GetTrainingDwr(employee_id, date, dateType, month, year, role, req.query.operation, taskId, module, type);
        const farmingDwr = GetFarmingDwr(employee_id, date, dateType, month, year, operation, status);
        const maintenanceDwr = GetMaintenanceRepairDwr(employee_id, date, dateType, month, year, operation, status);
        const otherDwr = GetOtherDwr(employee_id, date, dateType, month, year, operation, status);

        let query = ``;
        let result;

        let resp;
        if (req.query.operation === 'getDWRToVerify') {

            query = `${farmingDwr} ${maintenanceDwr} ${otherDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            let merged = result[0].rows.concat(result[1].rows, result[2].rows);

            const totals = Object.values(merged.reduce((acc, curr) => {
                const key = curr.employee_id;
                const employee_name = curr.employee_name;
                const supervisor_name = curr.supervisor_name;

                if (!acc[key]) {
                    acc[key] = {
                        employee_Id: key,
                        total_hours: 0,
                        employee_name: employee_name,
                        supervisor_name: supervisor_name
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

            query = `${farmingDwr} ${maintenanceDwr}  ${otherDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            let merged = result[0].rows.concat(result[1].rows, result[2].rows);

            resp = {
                dwr: merged
            };
        }

        if (req.query.operation === 'getDWRList') {

            query = `${farmingDwr} ${maintenanceDwr}  ${otherDwr}`;
            console.log(query);
            db.connect();
            result = await db.query(query);

            let merged = result[0].rows.concat(result[1].rows, result[2].rows);

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

