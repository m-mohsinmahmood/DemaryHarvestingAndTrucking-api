import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const fs = require('fs');

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
    Select 

    ht.created_at::Date as date,
    ht."id" AS "id",
    ht.truck_driver_id,
    ht.kart_operator_id,
    truck_driver.first_name || ' ' || truck_driver.last_name AS "truck_driver_name",
    kart_operator.first_name || ' ' || kart_operator.last_name AS "kart_operator_name",
    CUS.customer_name AS "customerName",
    farm."id" AS farm_id,
    field_id AS field_id,
    farm."name" AS farm_name,
    field."name" AS field_name,
    ht.crop_id AS crop_id,
    crops."name" as crop_name,
    ht."state" AS STATE,
    ht.destination AS destination,
    ht.loaded_miles, 
    splitfield."id" as sl_field_id,
    splitfield."name" as sl_field_name,
		ht.split_cart_scale_weight as cart_scale_weight,
		ht.scale_ticket_weight as scale_ticket_net_weight,
		ht.test_weight as test_weight,
		ht.moisture_content as moisture_content,
		ht.protein_content as protein_content,
    ht.split_load_check,
    ht.delivery_ticket_name,
    ht.farmers_bin_weight,
    ht.scale_ticket_number,
		ht.machinery_id as machinery_id,
		mv."name" as machinery_name,
		mv.company_name as machinery_company_name

    FROM
    
    "Harvesting_Delivery_Ticket" ht
    INNER JOIN "Employees" truck_driver ON ht.truck_driver_id = truck_driver.ID
    INNER JOIN "Employees" kart_operator ON ht.kart_operator_id = kart_operator.ID 
    INNER JOIN "Customers" CUS ON CUS."id" = ht.customer_id
    INNER JOIN "Customer_Farm" farm ON ht.farm_id = farm."id"
    INNER JOIN "Customer_Field" field ON ht.field_id = field."id" 
    LEFT JOIN "Customer_Field" splitfield ON ht.split_field_id = splitfield."id"::VARCHAR
    INNER JOIN "Crops" crops ON ht.crop_id = crops."id"::VARCHAR
    LEFT JOIN "Motorized_Vehicles" mv ON ht.machinery_id = mv.id::VARCHAR

  WHERE
  ht.ticket_status = '${ticketStatus}' 

  ${whereClause}

  order by ht.created_at DESC
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
