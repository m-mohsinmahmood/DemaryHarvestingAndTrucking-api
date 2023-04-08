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

    let query = `
      SELECT 
      *
      FROM 
      "Trucking_Delivery_Ticket"
      WHERE "id" = '${id}';`;


    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      ticket: result.rows[0]
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
