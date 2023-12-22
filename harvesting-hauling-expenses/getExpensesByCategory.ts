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

    try {
        let harvestingExpenses = getHarvestingExpenses(customer_id);
        let haulingExpenses = getHaulingExpenses(customer_id);
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
            totalEquipment: harvesting.combine_equip + harvesting.tractor_equip + harvesting.header_equipment + harvesting.grain_cart_equipment + hauling.truck_equip,
            totalLabor: 100,
            totalFuel: harvesting.combine_fuel + harvesting.tractor_fuel + hauling.truck_fuel,
            totalLodging: harvesting.employee_lodging_estimate + hauling.truck_driver_lodging_estimate,
            totalMiscellaneous: result.rows[0].customer_miscellaneous_expense
        }

        // Total of all expenses by Category
        let totalExpense = {
            totalEquipment: expenses.totalEquipment,
            totalLabor: expenses.totalLabor,
            totalFuel: expenses.totalFuel,
            totalLodging: expenses.totalLodging,
            totalMiscellaneous: expenses.totalMiscellaneous,
            totalCustomerExpenses: expenses.totalEquipment + expenses.totalLabor + expenses.totalFuel + expenses.totalLodging + expenses.totalMiscellaneous
        }

        // Percentages
        let percentOfTotal = {
            totalEquipment: (totalExpense.totalEquipment / totalExpense.totalCustomerExpenses) * 100,
            totalLabor: (totalExpense.totalLabor / totalExpense.totalCustomerExpenses) * 100,
            totalFuel: (totalExpense.totalFuel / totalExpense.totalCustomerExpenses) * 100,
            totalLodging: (totalExpense.totalLodging / totalExpense.totalCustomerExpenses) * 100,
            totalMiscellaneous: (totalExpense.totalMiscellaneous / totalExpense.totalCustomerExpenses) * 100,
            totalCustomerExpenses: (totalExpense.totalCustomerExpenses / totalExpense.totalCustomerExpenses) * 100
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
