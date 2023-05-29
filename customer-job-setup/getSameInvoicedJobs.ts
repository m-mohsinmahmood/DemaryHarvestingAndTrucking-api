import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const customer_id = req.query.customer_id;
  const farm_id = req.query.farm_id;
  const crop_id = req.query.crop_id;

  try {

    let assigned_roles_info_query = `
    Select 

    Count(id)

    from "Customer_Job_Setup" 

    where 

    customer_id = '${customer_id}'
    AND farm_id = '${farm_id}'
    AND crop_id = '${crop_id}'
    AND is_job_active = TRUE 
    AND is_job_completed = FALSE
    ;
      `;
      

    let query = `${assigned_roles_info_query}`;
    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      total_jobs: result.rows[0],
      status: 200,
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
