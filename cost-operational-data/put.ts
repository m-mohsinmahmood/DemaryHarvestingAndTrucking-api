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
        UPDATE "Cost_Operational_Data" 

        SET 
            "combine_equipment_cost"        = '${data.combine_equipment_cost}', 
            "tractor_equipment_cost"        = '${data.tractor_equipment_cost}', 
            "truck_equipment_cost"          = '${data.truck_equipment_cost}', 
            "grain_cart_equipment_cost"     = '${data.grain_cart_equipment_cost}', 
            "header_cost"                   = '${data.header_cost}', 
            "combine_fuel_rate"             = '${data.combine_fuel_rate}', 
            "tractor_fuel_rate"             = '${data.tractor_fuel_rate}', 
            "year"                          = '${data.year}', 
            "modified_at"                   = 'now()'

        WHERE 
            "id" = '${data.id}';
        `;

        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Data has been updated successfully.",
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
