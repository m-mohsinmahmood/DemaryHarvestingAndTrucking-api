import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { UpdateDeliveryTicket } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const updateTicket: UpdateDeliveryTicket = req.body;

        let optionalReq: string = ``;

        console.log(req.body);

        if (updateTicket.truckNo != null) {
            optionalReq = `${optionalReq},"truck_id" = '${updateTicket.truckNo}'`;
        }

        if (updateTicket.homeBeginingOdometerReading != null) {
            optionalReq = `${optionalReq},"home_beginning_OMR" = '${updateTicket.homeBeginingOdometerReading}'`;
        }

        if (updateTicket.originBeginingOdometerReading != null) {
            optionalReq = `${optionalReq},"origin_beginning_OMR" = '${updateTicket.originBeginingOdometerReading}'`;
        }

        if (updateTicket.destinationEndingOdometerReading != null) {
            optionalReq = `${optionalReq},"destination_ending_OMR" = '${updateTicket.destinationEndingOdometerReading}'`;
        }

        if (updateTicket.deadHeadMiles != null) {
            optionalReq = `${optionalReq},"dead_head_miles" = '${updateTicket.deadHeadMiles}'`;
        }

        if (updateTicket.totalJobMiles != null) {
            optionalReq = `${optionalReq},"total_job_miles" = '${updateTicket.totalJobMiles}'`;
        }

        if (updateTicket.totalTripMiles != null) {
            optionalReq = `${optionalReq},"total_trip_miles" = '${updateTicket.totalTripMiles}'`;
        }

        if (updateTicket.truckDriverNotes != null) {
            optionalReq = `${optionalReq},"truck_driver_notes" = '${updateTicket.truckDriverNotes}'`;
        }

        if (updateTicket.destinationDeliveryLoad != null) {
            optionalReq = `${optionalReq},"destinationDeliveryLoad" = '${updateTicket.destinationDeliveryLoad}'`;
        }

        if (updateTicket.destinationEmptyWeight != null) {
            optionalReq = `${optionalReq},"destinationEmptyWeight" = '${updateTicket.destinationEmptyWeight}'`;
        }

        if (updateTicket.destinationLoadedWeight != null) {
            optionalReq = `${optionalReq},"destinationLoadedWeight" = '${updateTicket.destinationLoadedWeight}'`;
        }

        if (updateTicket.originEmptyWeight != null) {
            optionalReq = `${optionalReq},"originEmptyWeight" = '${updateTicket.originEmptyWeight}'`;
        }

        if (updateTicket.originLoadedWeight != null) {
            optionalReq = `${optionalReq},"originLoadedWeight" = '${updateTicket.originLoadedWeight}'`;
        }

        if (updateTicket.originWeightLoad != null) {
            optionalReq = `${optionalReq},"originWeightLoad" = '${updateTicket.originWeightLoad}'`;
        }

        if (updateTicket.scaleTicket != null) {
            optionalReq = `${optionalReq},"scaleTicket" = '${updateTicket.scaleTicket}'`;
        }

        if (updateTicket.weightLoad != null) {
            optionalReq = `${optionalReq},"weightLoad" = '${updateTicket.weightLoad}'`;
        }

        if (updateTicket.isTicketActive != null) {
            optionalReq = `${optionalReq},"is_ticket_active" = '${updateTicket.isTicketActive}'`;
        }

        if (updateTicket.isTripCheckFilled != null) {
            optionalReq = `${optionalReq},"is_trip_check_filled" = '${updateTicket.isTripCheckFilled}'`;
        }

        if (updateTicket.isTicketInfoCompleted != null) {
            optionalReq = `${optionalReq},"is_ticket_info_completed" = '${updateTicket.isTicketInfoCompleted}'`;
        }

        if (updateTicket.begining_odometer_miles != null) {
            optionalReq = `${optionalReq},"begining_odometer_miles" = '${updateTicket.begining_odometer_miles}'`;
        }

        if (updateTicket.ending_odometer_miles != null) {
            optionalReq = `${optionalReq},"ending_odometer_miles" = '${updateTicket.ending_odometer_miles}'`;
        }

        if (updateTicket.hoursWorked != null) {
            optionalReq = `${optionalReq},"hours_worked" = '${updateTicket.hoursWorked}'`;
        }


        let query = `
    UPDATE 
        "Trucking_Delivery_Ticket"
    SET 
        "ticket_status" = '${updateTicket.ticketStatus}'
         ${optionalReq}
    WHERE 
        "id" = '${updateTicket.ticketNo}' ;`

        console.log(query);

        db.connect();

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Close Out Work Order has been updated successfully.",
                status: 200
            },
        };
        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
