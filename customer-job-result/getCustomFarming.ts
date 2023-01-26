import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  console.log(req.query);

  try {
    const customer_id: string = req.query.customer_id;

    let dwr_info_query = `
    SELECT 
    wo.id as id, 
    wo.created_at as date, 
    wo.service as service, 
    farm.name AS "farm_name", 
    field.name AS "field_name", 
    wo.total_acres as acres, 
    wo."total_gps-service-acres" as gps_acres, 
    dwr.start_time, 
    dwr.end_time 
  FROM 
    "Farming_Work_Order" wo 
    INNER JOIN "Customers" c ON wo."customer_id" = c."id" 
    INNER JOIN "Customer_Farm" farm ON wo.farm_id = farm.id 
    INNER JOIN "Customer_Field" field ON wo.field_id = field.id 
    INNER JOIN "DWR" dwr On wo."id" = dwr.work_order_id 
  Where 
    wo.work_order_is_completed = True 
    AND wo.work_order_status = 'verified' 
    And wo.work_order_close_out = True 
    And wo.customer_id = '${customer_id}'
    AND wo."is_deleted" = FALSE;

      `;



    let query = `${dwr_info_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      farmingJobs: result.rows
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
