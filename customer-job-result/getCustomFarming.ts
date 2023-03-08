import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const customer_id: string = req.query.customer_id;
  const service_type: string = req.query.service_type;
  const to: string = req.query.to;
  const from: string = req.query.from;
  const quantityType: string = req.query.quantity_type;

  console.log(req.query);
  let whereClause = ``;
  if (from) {
    whereClause = ` ${whereClause}  AND '${from}' <= wo.created_at::"date"`;
  }

  if (to) {
    whereClause = ` ${whereClause}  AND '${to}' >= wo.created_at::"date"`;
  }

  if (service_type) whereClause = ` ${whereClause}  AND wo.service = '${service_type}'`;



  try {

    let dwr_info_query = `
          
    SELECT 
    wo.id as id, 
    wo.created_at as date, 
    wo.service as service, 
    c."customer_name" AS "customer_name", 
    "farm".name AS "farm_name", 
    "field".name AS "field_name", 
    wo.total_acres as acres, 
    wo."total_gps_service_acres" as gps_acres, 
    dwr.start_time, 
    wo.work_order_status as status,
    CAST (wo.ending_engine_hours AS FLOAT) - CAST (wo.beginning_engine_hours AS FLOAT) as engine_hours,
    wo.modified_at as end_time,
    disp.first_name as disp_fname,
    disp.last_name as disp_lname,
    wo.beginning_engine_hours,
    wo.ending_engine_hours,
    wo.hours_worked,
    wo.notes,
    wo.acres_completed,
    wo.total_service_acres,
    wo.equipment_type,
    tractor_driver.first_name as tdriver_fname,
    tractor_driver.last_name as tdriver_lname
  
  FROM 
    "Farming_Work_Order" wo 
    INNER JOIN "Customers" c ON wo."customer_id" = c."id" 
    INNER JOIN "Customer_Farm" farm ON "farm".id = wo.farm_id 
    INNER JOIN "Customer_Field" field ON "field".id = wo.field_id 
    INNER JOIN "DWR" dwr On wo."id" = dwr.work_order_id 
    INNER JOIN "Employees" disp on disp."id" = wo.dispatcher_id
    INNER JOIN "Employees" tractor_driver on tractor_driver."id" = wo.tractor_driver_id
Where 
  wo.work_order_is_completed = True 
  And "work_order_close_out" = True 
  And wo.customer_id = '${customer_id}'
  ${whereClause}

  AND wo."is_deleted" = FALSE 
ORDER BY 
wo.created_at desc;

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
