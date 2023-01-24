import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { workOrder } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const order: workOrder = req.body;
        console.log(order);

        let optionalReq: string = ``;
        let optionalValues: string = ``;

        if (order.workOrderIsCompleted != null) {
            optionalReq = `${optionalReq},"work_order_is_completed"`;
            optionalValues = `${optionalValues},${order.workOrderIsCompleted}`
        }

        if (order.workOrderStatus != null) {
            optionalReq = `${optionalReq},"work_order_status"`;
            optionalValues = `${optionalValues},'${order.workOrderStatus}'`
        }

        if (order.workOrderCloseOut != null) {
            optionalReq = `${optionalReq},"work_order_close_out"`;
            optionalValues = `${optionalValues},'${order.workOrderCloseOut}'`
        }

        let query = ``;

        // If Tractor Driver will create a work Order then below given query will be executed.
        if (order.role === 'dispatcher') {
            query = `
            INSERT INTO 
                        "Farming_Work_Order" 
                        ("dispatcher_id", 
                        "customer_id", 
                        "farm_id", 
                        "field_id",
                        "service", 
                        "tractor_driver_id", 
                        "field_address", 
                        "customer_phone",
                        "complete_information",
                        "total_acres"
                        ${optionalReq})
      
            VALUES      ('${order.dispatcherId}', 
                        '${order.customerId}', 
                        '${order.farmId}', 
                        '${order.fieldId}', 
                        '${order.service}', 
                        '${order.tractorDriverId}', 
                        '${order.fieldAddress}', 
                        '${order.phone}',
                        '${order.completeInfo}',
                        '${order.totalAcres}'
                        ${optionalValues});
          `;
        }
        else {
            // If Dispatcher will create a work Order then below given query will be executed.
            query = `
            INSERT INTO 
                        "Farming_Work_Order" 
                        ("dispatcher_id", 
                        "beginning_engine_hours",
                        "customer_id", 
                        "farm_id", 
                        "field_id",
                        "service", 
                        "tractor_driver_id", 
                        "field_address", 
                        "customer_phone",
                        "machinery_id",
                        "complete_information",
                        "total_acres"
                        ${optionalReq})
      
            VALUES      ('${order.dispatcherId}', 
                        '${order.beginningEngineHours}',
                        '${order.customerId}', 
                        '${order.farmId}', 
                        '${order.fieldId}', 
                        '${order.service}', 
                        '${order.tractorDriverId}', 
                        '${order.fieldAddress}', 
                        '${order.phone}',
                        '${order.machineryID}',
                        '${order.completeInfo}',
                        '${order.totalAcres}'
                        ${optionalValues});
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
