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
    let query = `
        UPDATE 
                "Farming_Work_Order"
        SET 
                "total_service_acres"                    = '${workOrder.acresByService}',
                "total_gps_service_acres"                     = '${workOrder.gpsAcresByService}',
                "ending_engine_hours"                          = '${workOrder.endingEngineHours}',
                "work_order_close_out"                         = 'True',
              
        WHERE 
                "customerId" = '${workOrder.customerId}' And work_order_close_out = FALSE;`

                db.connect();
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
            