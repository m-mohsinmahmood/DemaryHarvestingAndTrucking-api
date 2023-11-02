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
            if (delivery_ticket.kartOperatorId != null && delivery_ticket.kartOperatorId != '' && delivery_ticket.kartOperatorId != 'null') {
                optionalReq = `${optionalReq},"kart_operator_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.kartOperatorId}'`
            }

            if (delivery_ticket.truckDriverId != null && delivery_ticket.truckDriverId != '' && delivery_ticket.truckDriverId != 'null') {
                optionalReq = `${optionalReq},"truck_driver_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.truckDriverId}'`
            }

            if (delivery_ticket.customer_id != null && delivery_ticket.customer_id != '' && delivery_ticket.customer_id != 'null') {
                optionalReq = `${optionalReq},"customer_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.customer_id}'`
            }

            if (delivery_ticket.farm_id != null && delivery_ticket.farm_id != '' && delivery_ticket.farm_id != 'null') {
                optionalReq = `${optionalReq},"farm_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.farm_id}'`
            }

            if (delivery_ticket.crop_id != null && delivery_ticket.crop_id != '' && delivery_ticket.crop_id != 'null') {
                optionalReq = `${optionalReq},"crop_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.crop_id}'`
            }

            if (delivery_ticket.state != null && delivery_ticket.state != '' && delivery_ticket.state != 'null') {
                optionalReq = `${optionalReq},"state"`;
                optionalValues = `${optionalValues},'${delivery_ticket.state}'`
            }

            if (delivery_ticket.destination != null && delivery_ticket.destination != '' && delivery_ticket.destination != 'null') {
                optionalReq = `${optionalReq},"destination"`;
                optionalValues = `${optionalValues},'${delivery_ticket.destination}'`
            }

            if (delivery_ticket.loadedMiles != null && delivery_ticket.loadedMiles != '' && delivery_ticket.loadedMiles != 'null') {
                optionalReq = `${optionalReq},"loaded_miles"`;
                optionalValues = `${optionalValues},'${+delivery_ticket.loadedMiles}'`
            }

            if (delivery_ticket.fieldId != null && delivery_ticket.fieldId != '' && delivery_ticket.fieldId != 'null') {
                optionalReq = `${optionalReq},"field_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.fieldId}'`
            }

            if (delivery_ticket.splitLoad != null && delivery_ticket.splitLoad != '' && delivery_ticket.splitLoad != 'null') {
                optionalReq = `${optionalReq},"split_load"`;
                optionalValues = `${optionalValues},'${delivery_ticket.splitLoad}'`
            }

            if (delivery_ticket.kartScaleWeight != null && delivery_ticket.kartScaleWeight != '' && delivery_ticket.kartScaleWeight != 'null') {
                optionalReq = `${optionalReq},"kart_scale_weight"`;
                optionalValues = `${optionalValues},'${+delivery_ticket.kartScaleWeight}'`
            }

            if (delivery_ticket.field_load_split != null && delivery_ticket.field_load_split != '' && delivery_ticket.field_load_split != 'null') {
                optionalReq = `${optionalReq},"split_field_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.field_load_split}'`
            }

            if (delivery_ticket.kart_scale_weight_split != null && delivery_ticket.kart_scale_weight_split != '' && delivery_ticket.kart_scale_weight_split != 'null') {
                optionalReq = `${optionalReq},"split_cart_scale_weight"`;
                optionalValues = `${optionalValues},'${+delivery_ticket.kart_scale_weight_split}'`
            }

            if (delivery_ticket.jobId != null && delivery_ticket.jobId != '' && delivery_ticket.jobId != 'null') {
                optionalReq = `${optionalReq},"job_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.jobId}'`
            }

            if (delivery_ticket.split_load_check != null) {
                optionalReq = `${optionalReq},"split_load_check"`;
                optionalValues = `${optionalValues},'${delivery_ticket.split_load_check}'`
            }

            if (delivery_ticket.deliveryTicketNumber != null && delivery_ticket.deliveryTicketNumber != '' && delivery_ticket.deliveryTicketNumber != 'null') {
                optionalReq = `${optionalReq},"delivery_ticket_number"`;
                optionalValues = `${optionalValues},'${delivery_ticket.deliveryTicketNumber}'`
            }

            if (delivery_ticket.farmers_bin_weight != null && delivery_ticket.farmers_bin_weight != '' && delivery_ticket.farmers_bin_weight != 'null') {
                optionalReq = `${optionalReq},"farmers_bin_weight"`;
                optionalValues = `${optionalValues},'${+delivery_ticket.farmers_bin_weight}'`
            }

            if (delivery_ticket.destinationId != null && delivery_ticket.destinationId != '' && delivery_ticket.destinationId != 'null') {
                optionalReq = `${optionalReq},"destination_id"`;
                optionalValues = `${optionalValues},'${delivery_ticket.destinationId}'`
            }

            if (delivery_ticket.guest_user_trucking_company != null && delivery_ticket.guest_user_trucking_company != '' && delivery_ticket.guest_user_trucking_company != 'null') {
                optionalReq = `${optionalReq},"trucking_company"`;
                optionalValues = `${optionalValues},'${delivery_ticket.guest_user_trucking_company}'`
            }

            query = `
        INSERT INTO 
                    "Harvesting_Delivery_Ticket" 
                    (
                    "ticket_status",
                    "machinery_id",
                    "created_at"
                    ${optionalReq}
                    )
  
        VALUES      (
                    CASE 
                    WHEN ${delivery_ticket.is_email_provided} = TRUE THEN 'sent'
                    ELSE 'pending'END,

                    CASE
                    WHEN ${delivery_ticket.is_email_provided} = FALSE THEN
                        (SELECT "truck_id" from "User_Profile" where employee_id = '${delivery_ticket.truckDriverId}')
                    ELSE '' END,

                    CURRENT_TIMESTAMP
                    ${optionalValues}
                    );

        INSERT INTO "User_Profile" (employee_id,loaded_miles)
        VALUES ('${delivery_ticket.kartOperatorId}','${+delivery_ticket.loadedMiles}')
        ON CONFLICT (employee_id) DO UPDATE SET loaded_miles = EXCLUDED.loaded_miles;
                    ;
      `;
        }

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Harvesting Delivery Ticket has been created successfully",
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
