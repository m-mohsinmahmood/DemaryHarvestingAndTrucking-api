import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { getTruckingJobResult } from "./invoicesUtilities";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const customer_id: string = req.query.customer_id;
    const to: string = req.query.to;
    const from: string = req.query.from;

    console.log(req.query);

    try {

        let totalAmount = getTruckingJobResult(from, to, customer_id);

        let queryToRun = `
        SELECT trucking.load_date,concat(dispatcher.first_name,' ' ,dispatcher.last_name) AS dispatcher,
        concat(driver.first_name,' ' ,driver.last_name) AS driver, trucking.id AS ticket_number, 
        trucking.cargo, trucking.destination_city, trucking.destination_state,
        trucking.ticket_status
 
        FROM "Trucking_Delivery_Ticket" trucking
         
        INNER JOIN "Employees" dispatcher ON trucking.dispatcher_id = dispatcher."id"
		INNER JOIN "Employees" driver ON trucking.truck_driver_id = driver."id"         
         
        WHERE trucking.customer_id = '${customer_id}' 
        AND trucking.ticket_status = 'verified'
        AND trucking.is_deleted = FALSE
        ORDER BY trucking.created_at ASC;
        ;`;

        let query = `${queryToRun} ${totalAmount}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);

        let totalResult = [];
        if (result[1].rows.length > 0)
            totalResult.push(result[1].rows)

        if (result[2].rows.length > 0)
            totalResult.push(result[2].rows)

        if (result[3].rows.length > 0)
            totalResult.push(result[3].rows)

        if (result[4].rows.length > 0)
            totalResult.push(result[4].rows)

        if (result[5].rows.length > 0)
            totalResult.push(result[5].rows)

        if (result[6].rows.length > 0)
            totalResult.push(result[6].rows)

        console.log("Total Result: ", totalResult);

        let resp = {
            jobResults: result[0].rows,
            totalAmount: totalResult
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
