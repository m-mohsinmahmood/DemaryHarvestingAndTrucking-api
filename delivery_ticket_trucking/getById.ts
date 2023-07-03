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
	
    td."id" AS "id",
    td.delivery_ticket_number AS delivery_ticket_number,
    td.load_date AS load_date,
    concat(EMP.first_name, ' ', EMP.last_name) AS "truckDriverName",
    CUS.customer_name AS "customerName",
    concat(disp.first_name, ' ', disp.last_name)  AS "dispatcherName", 
    td.cargo AS cargo,
    td.LOAD AS LOAD,
    td.origin_city AS originCity,
    td.origin_state,
    td.destination_city AS destinationCity,
    td.destination_state AS destinationState,
    tr.rate_type,
    tr.rate,
    td.dispatcher_notes AS dispatcher_notes,
    td.image_1,
    td.image_2,
    td.image_3,
    td.truck_id AS truckNo,
    td."home_beginning_OMR" AS homeOMR,
    td."origin_beginning_OMR" AS originBeginningOMR,
    td."destination_ending_OMR" AS destinationEndingOMR,
    td.total_trip_miles AS totalTripMiles,
    td.dead_head_miles AS deadHeadMiles,
    td.truck_driver_notes AS driverNotes,
    td."home_beginning_OMR" AS home_bor,
    td."originEmptyWeight" AS origin_empty_weight,
    td."destination_ending_OMR" AS destination_bor,
    td."originLoadedWeight" AS origin_loaded_weight,
    td."originWeightLoad" AS origin_weight_of_load,
    td.total_trip_miles AS total_trip_miles,
    td.dead_head_miles AS dead_head_miles,
    td.total_job_miles AS total_job_miles,
    td."destinationEmptyWeight" AS destination_empty_weight,
    td."destinationLoadedWeight" AS destination_loaded_weight,
    td."destinationDeliveryLoad" AS destination_delivery_load
 
  
    from "Trucking_Delivery_Ticket"  TD
   
    INNER JOIN "Employees" EMP ON TD.truck_driver_id = EMP.id
    INNER JOIN "Customers" CUS ON CUS."id" = TD.customer_id
    INNER JOIN "Employees" disp ON TD.dispatcher_id = disp.id
    INNER JOIN "Trucking_Rates" tr ON tr."id"::VARCHAR = td.rate_type

    where td.id = '${id}';`;


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
