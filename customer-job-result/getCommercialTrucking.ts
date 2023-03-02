import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const customer_id: string = req.query.customer_id;
  const to: string = req.query.to;
  const from: string = req.query.from;
  console.log(req.query);

  try {
    let whereClause = ``;

        if (from) whereClause = `${whereClause}  AND '${from}' <= td.created_at::"date"`;
        if (to) whereClause = ` ${whereClause}  AND '${to}' >= td.created_at::"date"`;


    let dwr_info_query = `
          
    SELECT
	td.ID AS ID,
	td.created_at AS load_date,
	td.cargo AS cargo,
	td.origin_city AS origin_city,
	td.destination_city AS dest_city,
	emp.first_name AS disp_first_name,
	emp.last_name AS disp_last_name,
	td.destination_state,
	tDriver."first_name" AS dr_first_name,
	tDriver."last_name" AS dr_last_name,
	td.ticket_status AS status,
	C.customer_name,
	td.dispatcher_notes,
	tr.rate,
	mach."name",
	td.total_job_miles,
	td.total_trip_miles,
	td.truck_driver_notes,
	td."weightLoad",
	td."scaleTicket",
	td.hours_worked,
	crop."name" 
FROM
	"Trucking_Delivery_Ticket" td
	INNER JOIN "Employees" emp ON td."dispatcher_id" = emp."id"
	INNER JOIN "Employees" tDriver ON td.truck_driver_id = tDriver."id"
	INNER JOIN "Customers" C ON td."customer_id" = C."id"
	INNER JOIN "Motorized_Vehicles" mach ON mach."id" = td.truck_id
	INNER JOIN "Trucking_Rates" tr ON CAST ( tr."id" AS VARCHAR ) = td.rate_type
	INNER JOIN "Crops" crop ON crop."id" = td.crop_id

Where 

td.customer_id = '${customer_id}' 
${whereClause}

  AND td."is_deleted" = FALSE
  ORDER BY 
td.created_at desc;
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
