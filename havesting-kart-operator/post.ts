import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { delivery_ticket } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const delivery_ticket: delivery_ticket = req.body;
    let optionalReq: string = ``;
    let optionalValues: string = ``;
    let query = ``;

    try {

        if (req.body.operation === 'createDeliveryTicket') {
            if (delivery_ticket.kartOperatorId != null) {
                optionalReq = `${optionalReq},"kart_operator_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.kartOperatorId}'`
            }

            if (delivery_ticket.truckDriverId != null) {
                optionalReq = `${optionalReq},"truck_driver_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.truckDriverId}'`
            }

            if (delivery_ticket.customerId != null) {
                optionalReq = `${optionalReq},"customer_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.customerId}'`
            }

            if (delivery_ticket.farmId != null) {
                optionalReq = `${optionalReq},"farm_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.farmId}'`
            }

            if (delivery_ticket.cropName != null) {
                optionalReq = `${optionalReq},"crop"`;
                optionalValues = `${optionalValues},'${delivery_ticket.cropName}'`
            }

            if (delivery_ticket.state != null) {
                optionalReq = `${optionalReq},"state"`;
                optionalValues = `${optionalValues},'${delivery_ticket.state}'`
            }

            if (delivery_ticket.destination != null) {
                optionalReq = `${optionalReq},"destination"`;
                optionalValues = `${optionalValues},'${delivery_ticket.destination}'`
            }

            if (delivery_ticket.loadedMiles != null) {
                optionalReq = `${optionalReq},"loaded_miles"`;
                optionalValues = `${optionalValues},'${delivery_ticket.loadedMiles}'`
            }

            if (delivery_ticket.fieldId != null) {
                optionalReq = `${optionalReq},"field_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.fieldId}'`
            }

            if (delivery_ticket.splitLoad != null) {
                optionalReq = `${optionalReq},"split_load"`;
                optionalValues = `${optionalValues},'${delivery_ticket.splitLoad}'`
            }

            if (delivery_ticket.kartScaleWeight != null) {
                optionalReq = `${optionalReq},"kart_scale_weight"`;
                optionalValues = `${optionalValues},'${delivery_ticket.kartScaleWeight}'`
            }

            if (delivery_ticket.truckId != null) {
                optionalReq = `${optionalReq},"truck_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.truckId}'`
            }
            query = `
        INSERT INTO 
                    "Harvesting_Delivery_Ticket" 
                    (
                    "ticket_status"
                    ${optionalReq}
                    )
  
        VALUES      (
                    'sent'
                    ${optionalValues}
                    );

        INSERT INTO "User_Profile" (employee_id, destination, loaded_miles, truck_driver_id)
        VALUES ('${delivery_ticket.kartOperatorId}', '${delivery_ticket.destination}', '${delivery_ticket.loadedMiles}', '${delivery_ticket.truckDriverId}')
        ON CONFLICT (employee_id) DO UPDATE SET destination = EXCLUDED.destination, loaded_miles = EXCLUDED.loaded_miles, truck_driver_id = EXCLUDED.truck_driver_id;
                    ;
      `;
        }

        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Farm Work Order has been created successfully",
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
