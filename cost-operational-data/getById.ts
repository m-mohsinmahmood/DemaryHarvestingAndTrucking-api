import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {

    const id: string = req.query.id;

    let info_query = `
        SELECT 

        id,
        combine_equipment_cost,
        tractor_equipment_cost,
        truck_equipment_cost,
        grain_cart_equipment_cost,
        header_cost,
        combine_fuel_rate,
        tractor_fuel_rate,
        year

        FROM 
            "Cost_Operational_Data"
        WHERE 
            "id" = '${id}';
        `;

    db.connect();

    let result = await db.query(info_query);
    let resp;
    if(result.rows.length > 0)
      resp = result.rows[0];
    else 
      resp = {
        message: "No data exists with this id."
      };

    db.end();

    context.res = {
      status: 200,
      body: resp,
    };

    context.done();
    return;
  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    context.done();
    return;
  }
};

export default httpTrigger;
