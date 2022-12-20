import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    // const customer_id: string = req.query.customerId;
    // const sort: string = req.query.sort ? req.query.sort : `created_at` ;
    // const order: string = req.query.order ? req.query.order : `desc`;
    // let whereClause: string = `WHERE "customer_id" = '${customer_id}' AND "is_deleted" = false`;

    let job_setup_query = `
        SELECT 
               *
        FROM
                "Customer_Job_Setup";
      `;

    let query = `${job_setup_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      customer_job: result.rows
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
