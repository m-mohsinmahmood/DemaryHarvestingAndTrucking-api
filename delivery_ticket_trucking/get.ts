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

    let whereClause: string = `And "td.is_deleted" = FALSE`;

    try {
        let queryToRun = ``;
        let count_query = ``;

        if (role === 'dispatcher') {
            // if (ticketStatus === 'sent') {
            let from = `from "Trucking_Delivery_Ticket"  TD
           
            INNER JOIN "Employees" EMP
            ON TD.truck_driver_id = EMP.id

            INNER JOIN "Customers" CUS
            ON CUS."id" = TD.customer_id
        
            INNER JOIN "Employees" disp
            ON TD.dispatcher_id = disp.id
            
            where dispatcher_id = '${employeeId}' And ticket_status = '${ticketStatus}'
            And trucking_type='${truckingType}' 
            `;

            queryToRun = `
            select

            TD."id" as "id",
            td.cargo as cargo,
            td.origin_city as originCity,
            td.destination_city as destination,
            td.destination_state as destinationState,
            td.truck_id as truckNo,
            td."home_beginning_OMR" as homeOMR,
            td."origin_beginning_OMR" as originBeginningOMR,
            td."destination_ending_OMR" as destinationEndingOMR,
            td.total_trip_miles as totalTripMiles,
            td.dead_head_miles as deadHeadMiles,
            td.truck_driver_notes as driverNotes,
            EMP.first_name as "truckDriverName",
            CUS.customer_name as "customerName",
            disp.first_name as "dispatcherName"
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
            `;

            // if (truckingType === 'home') {
                queryToRun = `
                select 
	            TD."id" as "id",
	            EMP.first_name as "truckDriverName",
	            CUS.customer_name as "customerName"
                ${from}
                ;`;
            // }
            // else{
            //     queryToRun = `
            //     select 
	        //     TD."id" as "id",
	        //     EMP.first_name as "truckDriverName",
	        //     CUS.customer_name as "customerName"
            //     ${from}
            //     ;`;
            // }

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
