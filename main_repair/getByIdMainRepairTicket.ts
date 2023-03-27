import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const ticket_id: string = req.query.id;

    let ticket_info_query = `
    SELECT
    mr.*
    FROM
    "Maintenance_Repair" mr
    
    INNER JOIN "Machinery" mach ON mr."equipmentId" = mach."id" 
    
        WHERE 
        mr."id" = '${ticket_id}';
      `;

    db.connect();

    let result = await db.query(ticket_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No ticket exists with this id.",
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
