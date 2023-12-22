import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingExpenses } from "./getExpenses";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const customer_id = req.query.customer_id;

    try {

        let grossMargin = `
        SELECT 
        
		invoiced_job_number,
		farm,
		crop,
		(crop_acres:: FLOAT * combining_rate:: FLOAT) AS revenue
		
        FROM (
                
            SELECT 
				job_setup_name AS invoiced_job_number,
				cjs.created_at,
				cjs.crop_acres AS crop_acres,
				crop.name AS crop,
				
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm,
				
				(
					Select combining_rate from "Combining_Rates"
					
					WHere customer_id = cjs.customer_id AND cjs.farm_id = farm_id AND cjs.crop_id = crop_id AND is_deleted = FALSE 
				) AS combining_rate
			
        FROM 
        "Customer_Job_Setup" cjs
		INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE

		WHERE cjs.customer_id = '${customer_id}'

            ) AS subquery ORDER BY created_at ASC;
        `;


        let harvestingExpense = getHarvestingExpenses(customer_id);
        let query = `${grossMargin} ${harvestingExpense}`

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

        console.log(result);

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
};

export default httpTrigger;
