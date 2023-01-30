import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const kartOperatorId = req.query.kartOperatorId;
    const truckDriverId: string = req.query.truckDriverId;
    const ticketStatus = req.query.ticketStatus;

    let whereClause: string = `AND ht.is_deleted = false`;

    if (kartOperatorId) whereClause = `${whereClause} And kart_operator_id = '${kartOperatorId}' `;
    if (truckDriverId) whereClause = `${whereClause} And truck_driver_id = '${truckDriverId}' `;

    let ticket_query = `
    SELECT

  ht."id" AS "id",
	ht.truck_driver_id,
	ht.kart_operator_id,
	truck_driver.first_name || ' ' || truck_driver.last_name  AS "truck_driver_name",
	kart_operator.first_name || ' ' || kart_operator.last_name  AS "kart_operator_name",
	CUS.customer_name AS "customerName",
	farm."id" as farm_id,
	field_id as field_id,
	farm."name" as farm_name,
	field."name" as field_name,
	ht.crop as crop_name,
	ht."state" as state,
	ht.destination as destination,
	ht.loaded_miles,
	ht.split_load,
	ht.kart_scale_weight,
	ht.truck_id  
  
    FROM
    "Harvesting_Delivery_Ticket" ht
    INNER JOIN "Employees" truck_driver ON ht.truck_driver_id = truck_driver.id
    INNER JOIN "Employees" kart_operator ON ht.kart_operator_id = kart_operator.id
    INNER JOIN "Customers" CUS ON CUS."id" = ht.customer_id 
    INNER JOIN "Customer_Farm" farm on ht.farm_id = farm."id"
    INNER JOIN "Customer_Field" field on ht.field_id = field."id"
  
     WHERE
     ht.ticket_status = '${ticketStatus}' 

     ${whereClause}
    ;`;

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
