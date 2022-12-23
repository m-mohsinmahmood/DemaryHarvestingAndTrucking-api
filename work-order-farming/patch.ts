import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { UpdateWorkOrder } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const workOrder: UpdateWorkOrder = req.body;

    let query = ``;

    if (workOrder.workOrderId != null) {
      // If user make a call from Existing Work Order of Tractor Driver

      query = `
        UPDATE 
                "Farming_Work_Order"
        SET 
                "dispatcher_id"                         = '${workOrder.dispatcherId}',
                "customer_id"                         = '${workOrder.customerId}',
                "farm_id"                         = '${workOrder.farmId}',
                "field_id"                         = '${workOrder.fieldId}',
                "service"                         = '${workOrder.service}',
                "tractor_driver_id"                         = '${workOrder.tractorDriverId}',
                "field_address"                         = '${workOrder.fieldAddress}',
                "customer_phone"                         = '${workOrder.phone}',
                "beginning_engine_hours"                         = '${workOrder.cBeginningEngineHours}',
                "work_order_is_completed"                         = 'false',
                "work_order_close_out"                         = 'false',
                "work_order_status"                         = ''
              
        WHERE 
                "id" = '${workOrder.workOrderId}';`
    }

    else {
      if (workOrder.role === 'dispatcher') {
        // If user make a call from Verify Work Order of Dispatcher

        query = `
        UPDATE 
                "Farming_Work_Order"
        SET 
                "work_order_close_out"                         = 'True',
                "work_order_is_completed"                         = 'True',
                "work_order_status"                         = 'verified'

              
        WHERE 
                "id" = '${workOrder.customerId}';`
      }

      if (workOrder.role === 'tractor-driver') {
        // If user make a call from Close Out Work Order  Work Order of Dispatcher

        query = `
        UPDATE 
                "Farming_Work_Order"
        SET 
                "total_service_acres"                    = '${workOrder.acresByService}',
                "total_gps-service-acres"                     = '${workOrder.gpsAcresByService}',
                "ending_engine_hours"                          = '${workOrder.endingEngineHours}',
                "work_order_close_out"                         = 'True',
                "work_order_is_completed"                         = 'True',
                "work_order_status"                         = 'pending'

              
        WHERE 
                "customer_id" = '${workOrder.customerId}' And work_order_close_out = FALSE;`
      }
    }

    db.connect();
    console.log(query);

    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Close Out Work Order has been updated successfully.",
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
