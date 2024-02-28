import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getHarvestingExpenses, getHaulingExpenses } from "./getExpenses";
const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const operation = req.query.operation;
    const customer_id = req.query.customer_id;
	let job_results: any = req.query.job_results;
    let jobSetupNames: string = '';

	// Extracting job setup names from the array
	if (job_results && job_results.length > 0) {
		job_results = JSON.parse(req.query.job_results);
		jobSetupNames = job_results.map(job => `'${job.job_setup_name}'`).join(',');
	}

    try {

        let query = '';

        if (operation == 'getHarvestingExpenses')
            query = getHarvestingExpenses(customer_id, jobSetupNames);

        else if (operation == 'getHaulingExpenses')
            query = getHaulingExpenses(customer_id, jobSetupNames);

        db.connect();

        let result = await db.query(query);

        let resp = {
            data: result[0].rows,
            subTotals: result[1].rows
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
