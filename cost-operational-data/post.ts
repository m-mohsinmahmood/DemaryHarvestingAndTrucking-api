import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { data } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const data: data = req.body;

        let query = `
        INSERT INTO 
                  "Cost_Operational_Data" 

                  ("combine_equipment_cost", 
                  "tractor_equipment_cost", 
                  "truck_equipment_cost",
                  "grain_cart_equipment_cost",
                  "header_cost",
                  "combine_fuel_rate",
                  "tractor_fuel_rate",
                  "year"
                  )
        VALUES 
                  ('${data.combine_equipment_cost}', 
                  '${data.tractor_equipment_cost}', 
                  '${data.truck_equipment_cost}',
                  '${data.grain_cart_equipment_cost}',
                  '${data.header_cost}',
                  '${data.combine_fuel_rate}',
                  '${data.tractor_fuel_rate}',
                  '${data.year}'
                  );
    `;
        db.connect();

        await db.query(query);
        db.end();
        //#endregion
        //#region Success Response
        context.res = {
            status: 200,
            body: {
                message: "Cost Operational Data has been successfully created",
            },
        };
        context.done();
        return;
        //#endregion
    } catch (error) {
        //#region Error Response
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        context.done();
        return;
        //#endregion
    }
};

export default httpTrigger;
