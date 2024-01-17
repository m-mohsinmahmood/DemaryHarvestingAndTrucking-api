import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingExpenses, getHaulingExpenses } from "../harvesting-hauling-expenses/getExpenses";
import { getHarvestingGrossMargin, getHaulingGrossMargin } from "../harvesting-hauling-expenses/grossMarginsFunctions";

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const db = new Client(config);
	const db2 = new Client(config);
	const expensesMap = new Map();
	const year: string = req.query.year;

	let whereClause: string = ``;

	if (year) {
		whereClause = ` AND EXTRACT(YEAR from cjs.created_at) = '${year}'`;
	}

	try {

		let query = `
        SELECT 
        
		invoiced_job_number,
		customer_name,
		created_at ::DATE AS job_created_date,
		modified_at ::DATE AS job_closed_out_date,
		modified_at::DATE - created_at::DATE AS total_days,
		state,
		crew_chief,
		director_name,
		farm AS farm_name,
		crop_name,
		crop_acres AS acres,
		combining_rate AS harvesting_rate,
		hauling_rate,
		rate_type AS hauling_rate_type,
		total_dht_loads AS dht_load_count,
		dht_total_loaded_miles AS total_miles,
		dht_average_loaded_miles AS avg_loaded_miles,
		total_net_pounds AS pounds,
		bushel_weight,
		total_net_pounds / bushel_weight AS bushels,
		combining_rate::FLOAT * crop_acres::FLOAT AS harvesting_revenue,
		hauling_rate::FLOAT * crop_acres::FLOAT AS hauling_revenue,
		(combining_rate::FLOAT * crop_acres::FLOAT) + (hauling_rate::FLOAT * crop_acres::FLOAT) AS total_revenue,
		(combining_rate::FLOAT * crop_acres::FLOAT)/combine_sh AS har_rev_sh,
		(hauling_rate::FLOAT * crop_acres::FLOAT)/total_loaded_dht_miles AS haul_rev_mmile,
		(combining_rate::FLOAT * crop_acres::FLOAT)/combine_labor AS har_rev_combine_labor_hour,
		(hauling_rate::FLOAT * crop_acres::FLOAT)/truck_driver_labor AS haul_rev_td_hour,
		crop_acres::FLOAT/combine_sh::FLOAT AS acres_sh,
	  (total_bushels::FLOAT) + (total_bushels::FLOAT - (crop_acres::FLOAT * base_rate)) AS quantity
		
FROM (
    SELECT 
				job_setup_name AS invoiced_job_number,
				cjs.created_at,
				cjs.modified_at,
				cjs."state",
				concat(crew.first_name, ' ', crew.last_name) AS crew_chief,
				concat(director.first_name, ' ', director.last_name) AS director_name,
				crop."name" AS crop_name,
				cjs.crop_acres,
				cr.combining_rate,
				hr.rate AS hauling_rate,
				hr.rate_type,
				crop.bushel_weight,
				calculate_weight(cjs.id) / crop.bushel_weight AS total_bushels,
				hr.base_rate,

 				(
					Select customer_name from "Customers" 
 				
					where id = cjs.customer_id AND is_deleted = FALSE
 				) AS customer_name,
				
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm,
				
				(
					Select count(hdt.id) AS total_dht_loads 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					WHERE td.is_guest_user = FALSE AND hdt.job_id = cjs.id
				),
				
				(	
					Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL
					WHERE td.is_guest_user = FALSE AND hdt.job_id = cjs.id
				),
			
				(	
					Select SUM(hdt.loaded_miles::FLOAT)/count(hdt.loaded_miles) AS dht_average_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL
					WHERE td.is_guest_user = FALSE AND hdt.job_id = cjs.id
				),
				
				(
					SELECT SUM(CAST(
					CASE
						WHEN ht.scale_ticket_weight = 'null' THEN 0 ELSE ht.scale_ticket_weight::NUMERIC END AS NUMERIC )) AS total_net_pounds
					FROM "Harvesting_Delivery_Ticket" ht
					WHERE  ht.field_id IS NOT NULL
					AND ht.is_deleted != TRUE
					AND ht.scale_ticket_weight IS NOT NULL
					AND ht.scale_ticket_weight <> '' 
					AND ht.job_id = cjs."id"
				) AS total_net_pounds,
				
				(
					Select SUM((dwr.ending_separator_hours::FLOAT)-(dwr.beginning_separator_hours::FLOAT)) from 
					"DWR" dwr
					INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id" AND machinery."type" = 'Combine'
					
					where dwr.job_id = cjs.id 
				) AS combine_sh,
				
				(
					Select SUM(hdt.loaded_miles::FLOAT) AS dht_total_loaded_miles 
					from "Harvesting_Delivery_Ticket" hdt
					LEFT JOIN "Employees" td ON td.id = hdt.truck_driver_id AND hdt.is_deleted != TRUE AND hdt.field_id IS NOT NULL 
					AND hdt.loaded_miles <> '' AND hdt.loaded_miles IS NOT NULL AND td.is_guest_user = FALSE
					WHERE hdt.job_id = cjs.id
				) AS total_loaded_dht_miles,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600) as "hours_difference" from 
					"DWR_Employees" dwr_employee	
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id 
					AND dwr_employee.role LIKE '%Combine Operator%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS combine_labor,
				
				(
					Select SUM(EXTRACT(EPOCH FROM (dwr_employee."modified_at" - dwr_employee."created_at")) / 3600) as "hours_difference" from 
				    "DWR_Employees" dwr_employee
					INNER JOIN "Bridge_DailyTasks_DWR" bridge ON dwr_employee.id = bridge.dwr_id
					INNER JOIN "DWR" dwr ON dwr.id = bridge.task_id AND dwr.role LIKE '%Truck Driver%'
					INNER JOIN "Employees" emp ON emp.id = dwr_employee.employee_id::UUID 
					
					where dwr.job_id = cjs.id AND dwr_employee.module = 'harvesting'
				) AS truck_driver_labor
		
			
				FROM 
                "Customer_Job_Setup" cjs
                INNER JOIN "Employees" crew ON crew.id = cjs.crew_chief_id AND crew.is_deleted = FALSE
                INNER JOIN "Employees" director ON director."id" = cjs.director_id AND director.is_deleted = FALSE
                INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE
                INNER JOIN "Combining_Rates" cr ON cjs.crop_id = cr.crop_id AND cjs.customer_id = cr.customer_id AND cr.is_deleted = FALSE
                INNER JOIN "Hauling_Rates" hr ON cjs.crop_id = hr.crop_id AND cjs.customer_id = hr.customer_id AND hr.is_deleted = FALSE

                ${whereClause}

        ) subquery ORDER BY created_at ASC;
    `;

		db.connect();
		db2.connect();

		let result = await db.query(query);
		let data = result.rows;

		let grossMarginHarvesting = getHarvestingGrossMargin('');
		let harvestingExpense = getHarvestingExpenses('');
		let grossMarginHauling = getHaulingGrossMargin('');
		let haulingExpense = getHaulingExpenses('');

		query = `${grossMarginHarvesting} ${harvestingExpense} ${grossMarginHauling} ${haulingExpense}`

		result = await db2.query(query);
		// To Get Harvesting Data to fetch Expenses from query
		result[0].rows.forEach((marginItem) => {
			const correspondingExpense = result[1].rows.find((expenseItem) => expenseItem.invoiced_job_number === marginItem.invoiced_job_number);
			if (correspondingExpense) {
				marginItem.expenses = correspondingExpense.total;
			}
		});

		let dataHarvesting = result[0].rows;

		// To get Hauling Data to fetch Expenses from query
		result[3].rows.forEach((marginItem) => {
			const correspondingExpense = result[4].rows.find((expenseItem) => expenseItem.invoiced_job_number === marginItem.invoiced_job_number);
			if (correspondingExpense) {
				marginItem.expenses = correspondingExpense.total;
			}
		});

		let dataHauling = result[3].rows;

		addExpenses(dataHarvesting, expensesMap);
		addExpenses(dataHauling, expensesMap);
		const combinedData = Array.from(expensesMap.values());

		const newExpensesMap = new Map();
		combinedData.forEach(entry => {
			const jobNumber = entry.invoiced_job_number;
			const total_expenses = entry.expenses;

			expensesMap.set(jobNumber, total_expenses);
		});

		// Add expenses from expensesMap to data
		data.forEach(entry => {
			const jobNumber = entry.invoiced_job_number;

			if (expensesMap.has(jobNumber)) {
				entry.total_expenses = expensesMap.get(jobNumber);
			}
		});

		data.forEach(entry => {
			// Calculate gross profit (revenue - expenses)
			entry.gross_profit = entry.total_revenue - entry.total_expenses;

			// Calculate gross margin (gross profit / revenue)
			entry.gross_margin = entry.gross_profit / entry.total_revenue;
		});

		let resp = {
			data: data
		};

		db.end();
		db2.end();

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

const addExpenses = (data, expensesMap) => {
	// Function to add harvesting and hauling expenses on basis of job to get total expense
	data.forEach(entry => {
		const jobNumber = entry.invoiced_job_number;
		let currentExpenses = entry.expenses || 0;

		if (expensesMap.has(jobNumber)) {
			// Add expenses to existing entry
			expensesMap.get(jobNumber).expenses += currentExpenses;
		} else {
			// Create a new entry if it doesn't exist
			expensesMap.set(jobNumber, { ...entry, expenses: currentExpenses });
		}
	});
}
