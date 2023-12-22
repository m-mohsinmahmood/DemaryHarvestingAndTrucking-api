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

        let grossMargin = `
        SELECT 
        
		invoiced_job_number,
		farm,
		crop,
		 CASE
            WHEN rate_type = 'Bushels' 
                THEN ( calculate_weight(job_id) / bushel_weight) * rate
            WHEN rate_type = 'Bushels + Excess Yield' 
                THEN ( ( calculate_weight(job_id) / bushel_weight) * premium_rate ) + ( ( ( calculate_weight(job_id) /bushel_weight) - (crop_acres::NUMERIC * base_bushels) ) * premium_rate )
            WHEN rate_type = 'Hundred Weight' 
                THEN (calculate_weight(job_id) / 100) * rate
            WHEN rate_type = 'Miles' 
                THEN (SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::INTEGER, 0)) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = job_id) * rate
            WHEN rate_type = 'Ton Miles' 
                THEN (SELECT (premium_rate * (SUM(COALESCE(NULLIF(loaded_miles, '')::INTEGER, 0))::FLOAT / COUNT(hdt.id)) + base_rate) * (calculate_weight(job_id) / 2000) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = job_id AND hdt.is_deleted = FALSE GROUP BY hdt.job_id)
            WHEN rate_type = 'Tons' 
                THEN (calculate_weight(job_id) / 2000) * rate
            WHEN rate_type = 'Load Count' 
                THEN (SELECT COUNT(hdt.id) FROM "Harvesting_Delivery_Ticket" hdt WHERE hdt.job_id = job_id) * rate
        ELSE 0
            END AS revenue
		
    FROM (
        SELECT 
				job_setup_name AS invoiced_job_number,
				cjs.created_at,
				cjs.crop_acres AS crop_acres,
				crop.name AS crop,
				crop.bushel_weight,
				hr.rate_type,
				hr.rate,
				hr.premium_rate,
				hr.base_bushels,
				hr.base_rate,
				cjs.id AS job_id,
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm
				
    FROM 
		"Customer_Job_Setup" cjs
		INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE
		INNER JOIN "Hauling_Rates" hr ON cjs.customer_id = hr.customer_id AND cjs.farm_id = hr.farm_id AND cjs.crop_id = hr.crop_id AND hr.is_deleted = FALSE

		WHERE cjs.customer_id = '${customer_id}'

) AS subquery ORDER BY created_at ASC;
        `;

        let HaulingExpense = getHaulingExpenses(customer_id);
        let query = `${grossMargin} ${HaulingExpense}`

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
            haulingGrossMargin: data,
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
