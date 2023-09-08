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
    const truckingType: string = req.query.truckingType;
    const isTicketInfoComplete: string = req.query.isTicketInfoComplete;
    const isTicketActive: string = req.query.isTicketActive;
    const isPreCHeckFilled: string = req.query.isPreCheckFilled;

    let whereClause: string = ``;
    if (isTicketInfoComplete) whereClause = ` ${whereClause}  AND td.is_ticket_info_completed = ${isTicketInfoComplete}`;
    if (isTicketActive) whereClause = ` ${whereClause}  And is_ticket_active=${isTicketActive}`;
    if (isPreCHeckFilled) whereClause = ` ${whereClause}  And is_trip_check_filled=${isPreCHeckFilled}`;

    console.log(req.query);

    try {
        let queryToRun = ``;
        let count_query = ``;

        if (role.includes('Dispatcher')) {
            // if (ticketStatus === 'sent') {
            let from = `from "Trucking_Delivery_Ticket"  TD
           
            INNER JOIN "Employees" EMP ON TD.truck_driver_id = EMP.id
            INNER JOIN "Customers" CUS ON CUS."id" = TD.customer_id
            INNER JOIN "Employees" disp ON TD.dispatcher_id = disp.id
            INNER JOIN "Trucking_Rates" tr ON tr."id"::VARCHAR = td.rate_type

            where dispatcher_id = '${employeeId}' And ticket_status = '${ticketStatus}'
            And trucking_type='${truckingType}' 
            `;

            queryToRun = `
            SELECT
	
            td."id" AS "id",
	        td.delivery_ticket_name AS delivery_ticket_number,
	        td.load_date AS load_date,
	        td.cargo AS cargo,
	        td.LOAD AS LOAD,
	        td.origin_city AS originCity,
	        td.origin_state,
	        td.destination_city AS destinationCity,
	        td.destination_state AS destinationState,
	        td.truck_id AS truckNo,
	        td."home_beginning_OMR" AS homeOMR,
	        td."origin_beginning_OMR" AS originBeginningOMR,
	        td."destination_ending_OMR" AS destinationEndingOMR,
	        td.total_trip_miles AS totalTripMiles,
	        td.dead_head_miles AS deadHeadMiles,
	        td.truck_driver_notes AS driverNotes,
	        td."home_beginning_OMR" AS home_bor,
	        td."originEmptyWeight" AS origin_empty_weight,
	        tr.rate_type,
	        tr.rate,
	        td."destination_ending_OMR" AS destination_bor,
	        td."originLoadedWeight" AS origin_loaded_weight,
	        td."originWeightLoad" AS origin_weight_of_load,
	        td.total_trip_miles AS total_trip_miles,
	        td.dead_head_miles AS dead_head_miles,
	        td.dispatcher_notes AS dispatcher_notes,
	        td.total_job_miles AS total_job_miles,
	        td."destinationEmptyWeight" AS destination_empty_weight,
	        td."destinationLoadedWeight" AS destination_loaded_weight,
	        td."destinationDeliveryLoad" AS destination_delivery_load,
	        concat(EMP.first_name, ' ', EMP.last_name) AS "truckDriverName",
	        CUS.customer_name AS "customerName",
	        concat(disp.first_name, ' ', disp.last_name)  AS "dispatcherName" 

            ${from}
            ;`;

            count_query = `
            SELECT  COUNT(TD."id") ${from};`;
            // }
        }
        else {
            let from = `from "Trucking_Delivery_Ticket"  TD
            INNER JOIN "Employees" EMP
            ON TD.truck_driver_id = EMP.id
            INNER JOIN "Customers" CUS
	        ON CUS."id" = TD.customer_id
            where truck_driver_id = '${employeeId}' And ticket_status = '${ticketStatus}'
            And trucking_type='${truckingType}' 
            ${whereClause}
            `;

            queryToRun = `
                select 
	            TD."id" as "id",
	            EMP.first_name as "truckDriverName",
	            CUS.customer_name as "customerName",
                TD.truck_id as truck_id
                ${from}
                ;`;

            count_query = `
            SELECT  COUNT(TD."id") ${from};`;
        }

        let query = `${queryToRun} ${count_query}`;

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
