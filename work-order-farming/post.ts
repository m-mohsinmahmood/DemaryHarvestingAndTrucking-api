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

        let query = `
      INSERT INTO 
                  "Farming_Work_Order" 
                  ("dispatcher_id", 
                  "customer_id", 
                  "farm_id", 
                  "field_id", 
                  "tractor_driver", 
                  "field_address", 
                  "customer_phone")
      VALUES      ('${order.dispatcher_id}', 
                  '${order.customer_id}', 
                  '${order.farm_id}', 
                  '${order.field_id}', 
                  '${order.tractor_driver}', 
                  '${order.field_address}', 
                  '${order.customer_phone}');
    `;

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
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
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
