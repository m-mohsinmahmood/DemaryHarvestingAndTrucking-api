import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  try {
    const ticket_status: string = req.query.status;

        let ticket_status_query = `
        SELECT * FROM "Harvesting_Ticket" ht
     
        INNER JOIN "Employees" emp
        
        ON ht."truck_driver_id"=emp."id"
        
        AND ht."status"='${ticket_status}';
            `;

    db.connect();

    let result = await db.query(ticket_status_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows;
    else
      resp = {
        message: "No ticket (Sent) exists with this id.",
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
