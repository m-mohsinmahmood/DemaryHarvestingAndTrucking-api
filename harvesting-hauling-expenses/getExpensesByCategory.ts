import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingExpenses, getHaulingExpenses } from "./getExpenses";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const customer_id = req.query.customer_id;
    let job_results: any = req.query.job_results;
    let jobSetupNames: string = '';

    // Extracting job setup names from the array
    if (job_results && job_results.length > 0) {
        job_results = JSON.parse(req.query.job_results);
        jobSetupNames = job_results.map(job => `'${job.job_setup_name}'`).join(',');
    }

    try {
        let harvestingExpenses = getHarvestingExpenses(customer_id, jobSetupNames);
        let haulingExpenses = getHaulingExpenses(customer_id, jobSetupNames);
        let query = `${harvestingExpenses} ${haulingExpenses}`;

        db.connect();

        let result = await db.query(query);

        let harvesting = result[1].rows[0];
        let hauling = result[3].rows[0];

        let totalMiscellaneous = `
            Select customer_miscellaneous_expense from "Customer_Cost_Operational_Data" LIMIT 1
        `;

        result = await db.query(totalMiscellaneous);

        // Indivisual Expenses
        let expenses = {
            totalEquipment: Number(harvesting?.combine_equip) + Number(harvesting?.tractor_equip) + Number(harvesting?.header_equipment) + Number(harvesting?.grain_cart_equipment) + Number(hauling?.truck_equip),
            totalLabor: Number(harvesting?.combine_labor) + Number(harvesting?.cart_operator_labor) + Number(hauling?.truck_labor),
            totalFuel: Number(harvesting?.combine_fuel) + Number(harvesting?.tractor_fuel) + Number(hauling?.truck_fuel),
            totalLodging: Number(harvesting?.employee_lodging_estimate) + Number(hauling?.truck_driver_lodging_estimate),
            totalMiscellaneous: Number(result?.rows[0]?.customer_miscellaneous_expense)
        }

        // Total of all expenses by Category
        let totalExpense = {
            totalEquipment: expenses?.totalEquipment,
            totalLabor: expenses?.totalLabor,
            totalFuel: expenses?.totalFuel,
            totalLodging: expenses?.totalLodging,
            totalMiscellaneous: expenses?.totalMiscellaneous,
            totalCustomerExpenses: expenses?.totalEquipment + expenses?.totalLabor + expenses?.totalFuel + expenses?.totalLodging + expenses?.totalMiscellaneous
        }

        // Percentages
        let percentOfTotal = {
            totalEquipment: (totalExpense?.totalEquipment / totalExpense?.totalCustomerExpenses) * 100,
            totalLabor: (totalExpense?.totalLabor / totalExpense?.totalCustomerExpenses) * 100,
            totalFuel: (totalExpense?.totalFuel / totalExpense?.totalCustomerExpenses) * 100,
            totalLodging: (totalExpense?.totalLodging / totalExpense?.totalCustomerExpenses) * 100,
            totalMiscellaneous: (totalExpense?.totalMiscellaneous / totalExpense?.totalCustomerExpenses) * 100,
            totalCustomerExpenses: (totalExpense?.totalCustomerExpenses / totalExpense?.totalCustomerExpenses) * 100
        }

        let resp = {
            totals: totalExpense,
            percentOfTotal: percentOfTotal
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
