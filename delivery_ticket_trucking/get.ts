import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const role: string = req.query.role;
    const ticketStatus: string = req.query.ticketStatus;
    const employeeId: string = req.query.employeeId;

    let whereClause: string = `"is_deleted" = FALSE`;

    try {
        let queryGetCustomers = ``;
        let count_query = ``;

        if (role === 'dispatcher' && ticketStatus === 'sent') {
            //////////////////////////////////////////////////////
            let from = `from "Trucking_Delivery_Ticket"  TD
            INNER JOIN "Employees" EMP
            ON TD.truck_driver_id = EMP.id
            INNER JOIN "Customers" CUS
	        ON CUS."id" = TD.customer_id
            where dispatcher_id = '${employeeId}' And ticket_status = '${ticketStatus}'
            `;

            queryGetCustomers = `
            select 
	        TD."id" as "id",
	        EMP.first_name as "truckDriverName",
	        CUS.customer_name as "customerName"
            ${from}
            ;`;

            count_query = `
            SELECT  COUNT(TD."id") ${from};`;

            // If we make a call from Beginning of Day Work Order
        }

        let query = `${queryGetCustomers} ${count_query}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            workOrders: result[0].rows,
            count: +result[1].rows[0].count,
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
