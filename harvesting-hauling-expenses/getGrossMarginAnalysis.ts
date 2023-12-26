import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingExpenses, getHaulingExpenses } from "./getExpenses";
import { getHarvestingGrossMargin, getHaulingGrossMargin } from "./grossMarginsFunctions";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const customer_id = req.query.customer_id;
    const operation = req.query.operation;

    let query;

    if (req.query.operation == 'getHarvestingGrossMargin' || req.query.operation == 'getHaulingGrossMargin') {
        try {

            if (operation == 'getHarvestingGrossMargin') {
                let grossMargin = getHarvestingGrossMargin(customer_id);

                let harvestingExpense = getHarvestingExpenses(customer_id);
                query = `${grossMargin} ${harvestingExpense}`
            }

            else if (operation == 'getHaulingGrossMargin') {
                let grossMargin = getHaulingGrossMargin(customer_id);

                let haulingExpense = getHaulingExpenses(customer_id);
                query = `${grossMargin} ${haulingExpense}`
            }

            db.connect();

            let result = await db.query(query);

            // To calcualte expenses, gross profit and gross margin
            result[0].rows.forEach((marginItem) => {
                const correspondingExpense = result[1].rows.find((expenseItem) => expenseItem.invoiced_job_number === marginItem.invoiced_job_number);
                if (correspondingExpense) {
                    marginItem.expenses = correspondingExpense.total;
                    marginItem.grossProfits = marginItem.revenue - marginItem.expenses;
                    marginItem.grossMargin = (marginItem.revenue - marginItem.expenses) / marginItem.revenue;
                }
            });

            let data = result[0].rows;
            let subTotals = data.reduce(
                (totals, item) => {
                    totals.revenue += item.revenue || 0;
                    totals.expenses += item.expenses || 0;
                    totals.grossProfits += item.grossProfits || 0;
                    totals.grossMargin = totals.grossProfits / totals.revenue;
                    return totals;
                },
                { revenue: 0, expenses: 0, grossProfits: 0 }
            );

            let resp = {
                harvestingGrossMargin: data,
                subTotal: subTotals
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
    }

    else if (req.query.operation == 'getByTotalJobs') {
        try {

            // if (operation == 'getHarvestingGrossMargin') {
            let grossMarginHarvesting = getHarvestingGrossMargin(customer_id);

            let harvestingExpense = getHarvestingExpenses(customer_id);
            query = `${grossMarginHarvesting} ${harvestingExpense}`
            // }

            // else if (operation == 'getHaulingGrossMargin') {
            let grossMarginHauling = getHaulingGrossMargin(customer_id);

            let haulingExpense = getHaulingExpenses(customer_id);
            query = `${grossMarginHarvesting} ${harvestingExpense} ${grossMarginHauling} ${haulingExpense}`
            // }

            db.connect();

            let result = await db.query(query);

            // To Get Harvesting Data
            result[0].rows.forEach((marginItem) => {
                const correspondingExpense = result[1].rows.find((expenseItem) => expenseItem.invoiced_job_number === marginItem.invoiced_job_number);
                if (correspondingExpense) {
                    marginItem.expenses = correspondingExpense.total;
                    marginItem.grossProfits = marginItem.revenue - marginItem.expenses;
                    marginItem.grossMargin = (marginItem.revenue - marginItem.expenses) / marginItem.revenue;
                }
            });

            let dataHarvesting = result[0].rows;
            let subTotalsHarvesting = dataHarvesting.reduce(
                (totals, item) => {
                    totals.revenue += item.revenue || 0;
                    totals.expenses += item.expenses || 0;
                    totals.grossProfits += item.grossProfits || 0;
                    totals.grossMargin = totals.grossProfits / totals.revenue;
                    return totals;
                },
                { revenue: 0, expenses: 0, grossProfits: 0 }
            );

            // To get Hauling Data
            result[3].rows.forEach((marginItem) => {
                const correspondingExpense = result[4].rows.find((expenseItem) => expenseItem.invoiced_job_number === marginItem.invoiced_job_number);
                if (correspondingExpense) {
                    marginItem.expenses = correspondingExpense.total;
                    marginItem.grossProfits = marginItem.revenue - marginItem.expenses;
                    marginItem.grossMargin = (marginItem.revenue - marginItem.expenses) / marginItem.revenue;
                }
            });

            let dataHauling = result[3].rows;
            let subTotalsHauling = dataHarvesting.reduce(
                (totals, item) => {
                    totals.revenue += item.revenue || 0;
                    totals.expenses += item.expenses || 0;
                    totals.grossProfits += item.grossProfits || 0;
                    totals.grossMargin = totals.grossProfits / totals.revenue;
                    return totals;
                },
                { revenue: 0, expenses: 0, grossProfits: 0 }
            );


            const combinedMap = new Map();

            dataHarvesting.forEach(item => {
                const jobNumber = item.invoiced_job_number;
                if (!combinedMap.has(jobNumber)) {
                    combinedMap.set(jobNumber, { ...item });
                } else {
                    const combinedItem = combinedMap.get(jobNumber);
                    combinedItem.revenue += item.revenue;
                    combinedItem.expenses += item.expenses;
                }
            });

            dataHauling.forEach(item => {
                const jobNumber = item.invoiced_job_number;
                if (!combinedMap.has(jobNumber)) {
                    combinedMap.set(jobNumber, { ...item });
                } else {
                    const combinedItem = combinedMap.get(jobNumber);
                    combinedItem.revenue += item.revenue;
                    combinedItem.expenses += item.expenses;
                    combinedItem.grossProfits = combinedItem.revenue - combinedItem.expenses;
                    combinedItem.grossMargin = combinedItem.grossProfits / combinedItem.revenue;
                }
            });

            const combinedGrossMargin = Array.from(combinedMap.values());

            let totalByJob = combinedGrossMargin.reduce(
                (acc, item) => {
                    acc.totalRevenue += item.revenue;
                    acc.totalExpenses += item.expenses;
                    acc.totalGrossProfits += item.grossProfits;
                    return acc;
                },
                { totalRevenue: 0, totalExpenses: 0, totalGrossProfits: 0 }
            );
            totalByJob.totalGrossMargin = totalByJob.totalGrossProfits / totalByJob.totalRevenue;

            totalByJob = {
                revenue: totalByJob.totalRevenue,
                expenses: totalByJob.totalExpenses,
                grossProfits: totalByJob.totalGrossProfits,
                grossMargin : totalByJob.totalGrossMargin
            }

            let resp = {
                // harvestingGrossMargin: dataHarvesting,
                // harvestingSubTotal: subTotalsHarvesting,
                // haulingGrossMargin: dataHauling,
                // haulingSubTotal: subTotalsHauling,
                totalByJob: combinedGrossMargin,
                subTotal: totalByJob
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
    }
};

export default httpTrigger;
