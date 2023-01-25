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
  td.id as id, 
  td.created_at as load_date, 
  td.cargo as cargo, 
	td.origin_city as origin_city,
	td.destination_city as dest_city,
  emp.first_name AS disp_first_name,
	emp.last_name AS disp_last_name,

	tDriver."first_name" AS dr_first_name,
	tDriver."last_name" AS dr_last_name,
  td.ticket_status as status 
	
FROM 
  "Trucking_Delivery_Ticket" td 
  INNER JOIN "Employees" emp ON td."dispatcher_id" = emp."id" 
	INNER JOIN "Employees" tDriver ON td.truck_driver_id = emp."id" 

Where 

 td.ticket_status = 'verified' 
  And td.customer_id = '${customer_id}' 
  AND td."is_deleted" = FALSE;
      `;



    let query = `${dwr_info_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      truckingJobs: result.rows
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
