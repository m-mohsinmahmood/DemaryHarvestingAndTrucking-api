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
  c."customer_name" AS "customer_name", 
  "farm".name AS "farm_name", 
  "field".name AS "field_name", 
  wo.total_acres as acres, 
  wo."total_gps-service-acres" as gps_acres, 
  dwr.start_time, 
  wo.work_order_status as status,
  CAST (wo.ending_engine_hours AS FLOAT) - CAST (wo.beginning_engine_hours AS FLOAT) as engine_hours,
  wo.created_at,
  wo.modified_at as end_time

FROM 
  "Farming_Work_Order" wo 
  INNER JOIN "Customers" c ON wo."customer_id" = c."id" 
  INNER JOIN "Customer_Farm" farm ON "farm".id = wo.farm_id 
  INNER JOIN "Customer_Field" field ON "field".id = wo.field_id 
  INNER JOIN "DWR" dwr On wo."id" = dwr.work_order_id 
Where 
  wo.work_order_is_completed = True 
  AND "work_order_status" = 'verified' 
  And "work_order_close_out" = True 
  And wo.customer_id = '${customer_id}'
  AND wo."is_deleted" = FALSE 
ORDER BY 
  c."customer_name" ASC;

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
