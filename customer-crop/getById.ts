import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_crop_id: string = req.query.id;

    let customer_crop_info_query = `
        SELECT 
                cc."id" as "customer_crop_id", 
                c."name" as "crop_name", 
                cc."calendar_year"
        FROM 
                "Crops" c
                INNER JOIN "Customer_Crop" cc 
                ON c."id" = cc."crop_id" AND cc."id" = '${customer_crop_id}';
      `;

    db.connect();

    let result = await db.query(customer_crop_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No customer crop exists with this id.",
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
