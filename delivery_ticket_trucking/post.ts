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

        // if (order.load != null) {
        //     optionalReq = `${optionalReq},"beginning_engine_hours"`;
        //     optionalValues = `${optionalValues},'${order.load}'`
        // }

        // if (order.loadDate != null) {
        //     optionalReq = `${optionalReq},"beginning_engine_hours"`;
        //     optionalValues = `${optionalValues},'${order.loadDate}'`
        // }

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
                        "dispatcher_notes", 
						"customer_id",
						"trucking_type",
						"ticket_status"
                        ${optionalReq})
      
            VALUES      ('${order.dispatcherId}', 
                        '${order.driverId}', 
                        '${order.cargo}', 
                        '${order.originCity}', 
                        '${order.destinationCity}',
                        '${order.destinationState}', 
                        '${order.dispatcherNotes}', 
                        '${order.customerId}', 
						'${order.truckingType}',
                        '${order.ticketStatus}'
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
