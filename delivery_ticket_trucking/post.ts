import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { DeliveryTicket } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const order: DeliveryTicket = req.body;

        let query = ``;
        let optionalReq: string = ``;
        let optionalValues: string = ``;

        if (order.load != null) {
            optionalReq = `${optionalReq},"load"`;
            optionalValues = `${optionalValues},'${order.load}'`
        }

        if (order.loadDate != null) {
            optionalReq = `${optionalReq},"load_date"`;
            optionalValues = `${optionalValues},'${order.loadDate}'`
        }

        if (order.destinationEndingnOdometerReading != null) {
            optionalReq = `${optionalReq},"destination_ending_OMR"`;
            optionalValues = `${optionalValues},'${order.destinationEndingnOdometerReading}'`
        }

        if (order.homeBeginingOdometerReading != null) {
            optionalReq = `${optionalReq},"home_beginning_OMR"`;
            optionalValues = `${optionalValues},'${order.homeBeginingOdometerReading}'`
        }

        if (order.originBeginingOdometerReading != null) {
            optionalReq = `${optionalReq},"origin_beginning_OMR"`;
            optionalValues = `${optionalValues},'${order.originBeginingOdometerReading}'`
        }

        if (order.truckNo != null) {
            optionalReq = `${optionalReq},"truck_id"`;
            optionalValues = `${optionalValues},'${order.truckNo}'`
        }

        if (order.deadHeadMiles != null) {
            optionalReq = `${optionalReq},"dead_head_miles"`;
            optionalValues = `${optionalValues},'${order.deadHeadMiles}'`
        }

        if (order.totalJobMiles != null) {
            optionalReq = `${optionalReq},"total_job_miles"`;
            optionalValues = `${optionalValues},'${order.totalJobMiles}'`
        }

        if (order.totalTripMiles != null) {
            optionalReq = `${optionalReq},"total_trip_miles"`;
            optionalValues = `${optionalValues},'${order.totalTripMiles}'`
        }

        if (order.truckDriverNotes != null) {
            optionalReq = `${optionalReq},"truck_driver_notes"`;
            optionalValues = `${optionalValues},'${order.truckDriverNotes}'`
        }

        if (order.dispatcherNotes != null) {
            optionalReq = `${optionalReq},"dispatcher_notes"`;
            optionalValues = `${optionalValues},'${order.dispatcherNotes}'`
        }

        if (order.rateType != null) {
            optionalReq = `${optionalReq},"rate_type"`;
            optionalValues = `${optionalValues},'${order.rateType}'`
        }

        if (order.originEmptyWeight != null) {
            optionalReq = `${optionalReq},"originEmptyWeight"`;
            optionalValues = `${optionalValues},'${order.originEmptyWeight}'`
        }

        if (order.originLoadedWeight != null) {
            optionalReq = `${optionalReq},"originLoadedWeight"`;
            optionalValues = `${optionalValues},'${order.originLoadedWeight}'`
        }

        if (order.originWeightLoad != null) {
            optionalReq = `${optionalReq},"originWeightLoad"`;
            optionalValues = `${optionalValues},'${order.originWeightLoad}'`
        }

        if (order.destinationLoadedWeight != null) {
            optionalReq = `${optionalReq},"destinationLoadedWeight"`;
            optionalValues = `${optionalValues},'${order.destinationLoadedWeight}'`
        }

        if (order.destinationEmptyWeight != null) {
            optionalReq = `${optionalReq},"destinationEmptyWeight"`;
            optionalValues = `${optionalValues},'${order.destinationEmptyWeight}'`
        }

        if (order.weightLoad != null) {
            optionalReq = `${optionalReq},"weightLoad"`;
            optionalValues = `${optionalValues},'${order.weightLoad}'`
        }

        if (order.scaleTicket != null) {
            optionalReq = `${optionalReq},"scaleTicket"`;
            optionalValues = `${optionalValues},'${order.scaleTicket}'`
        }

        if (order.destinationDeliveryLoad != null) {
            optionalReq = `${optionalReq},"destinationDeliveryLoad"`;
            optionalValues = `${optionalValues},'${order.destinationDeliveryLoad}'`
        }

        if (order.cropId != null) {
            optionalReq = `${optionalReq},"crop_id"`;
            optionalValues = `${optionalValues},'${order.cropId}'`
        }

        if (order.hoursWorked != null) {
            optionalReq = `${optionalReq},"hours_worked"`;
            optionalValues = `${optionalValues},'${order.hoursWorked}'`
        }

        // If Dispatcher will create a New Delivery Ticket then below given query will be executed.
        query = `
            INSERT INTO 
                        "Trucking_Delivery_Ticket" 
                        ("dispatcher_id", 
                        "truck_driver_id", 
                        "cargo", 
                        "origin_city",
                        "destination_city", 
                        "destination_state", 
						"customer_id",
						"trucking_type",
						"ticket_status",
                        "is_ticket_info_completed"
                        ${optionalReq})
      
            VALUES      ('${order.dispatcherId}', 
                        '${order.driverId}', 
                        '${order.cargo}', 
                        '${order.originCity}', 
                        '${order.destinationCity}',
                        '${order.destinationState}', 
                        '${order.customerId}', 
						'${order.truckingType}',
                        '${order.ticketStatus}',
                        '${order.isTicketInfoCompleted}'
                        ${optionalValues});
          `;

        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Delivery Ticket of trucking has been created successfully",
            },
        };

        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                status: 500,
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
