import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const truckDriverId: string = req.body.truckDriverId;
    const id: string = req.body.id;

    console.log(req.body);

    try {

        let query = `
        UPDATE 
                "Harvesting_Delivery_Ticket"
        SET 
                "truck_driver_id"= '${truckDriverId}'
        WHERE 
                "id" ='${id}';
      `;

        console.log(query);

        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "",
                status: 200,
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
