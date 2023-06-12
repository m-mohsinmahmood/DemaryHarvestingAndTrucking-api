import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  const db = new Client(config);

  try {
    let ticket_query = `
    Select Max(delivery_ticket_name) from "Harvesting_Delivery_Ticket";`;

    let query = `${ticket_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = result.rows;

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
