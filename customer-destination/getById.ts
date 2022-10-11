import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_destination_id: string = req.query.id;

    let customer_contact_info_query = `
        SELECT 
                f."id" AS "farm_id", 
                f."name" as "farm_name", 
                d."id" as "destination_id", 
                d."name" as "destination_name", 
                d."calendar_year"
        FROM 
                "Customer_Farm" f
                INNER JOIN "Customer_Destination" d 
                ON f."id" = d."farm_id" AND d."id" = '${customer_destination_id}';
      `;

    db.connect();

    let result = await db.query(customer_contact_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No customer destination exists with this id.",
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
