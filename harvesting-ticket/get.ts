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
    const ticket_name = req.query.ticket_name;
    let limit = null;

    let whereClause: string = `ht.is_deleted = false`;

    if (kartOperatorId) whereClause = `${whereClause} And kart_operator_id = '${kartOperatorId}' `;
    if (truckDriverId) whereClause = `${whereClause} And truck_driver_id = '${truckDriverId}' `;

    if (ticketStatus == 'verified' && kartOperatorId || ticketStatus == 'verified' && truckDriverId) {
      // All tickets with status verified updated within 24 hours
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      whereClause = `${whereClause} AND ht.modified_at > '${startDate}'::timestamp AND ht.modified_at < '${endDate}'::timestamp`
    }

    if (ticketStatus == 'print') {
      // Tickets for print segment, all tickets with status either sent or pending
      if (kartOperatorId) {
        limit = 20;

        whereClause = `${whereClause} AND (ht.ticket_status = 'pending' OR ht.ticket_status = 'sent')`

        if (ticket_name != null) {
          // Search ticket to print
          whereClause = `${whereClause} AND delivery_ticket_name = '${ticket_name}'`
        }
      }
    }
    else {
      whereClause = `${whereClause} AND ht.ticket_status = '${ticketStatus}'`
    }

   

    let ticket_query = `
    Select 

    ht.created_at as date,
    ht."id" AS "id",
    ht.truck_driver_id,
    ht.kart_operator_id,
    truck_driver.first_name || ' ' || truck_driver.last_name AS "truck_driver_name",
    kart_operator.first_name || ' ' || kart_operator.last_name AS "kart_operator_name",
    CUS.customer_name AS "customerName",
    CUS.id AS "customerId",
    farm."id" AS farm_id,
    ht.field_id AS field_id,
    farm."name" AS farm_name,
    field."name" AS field_name,
    ht.crop_id AS crop_id,
    crops."name" as crop_name,
    ht."state" AS STATE,
    ht.destination AS destination,
    ht.destination_id AS destinationId,
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
		mv.company_name as machinery_company_name,
    crew_chief."id" AS crew_chief_id,
    concat(crew_chief.first_name, ' ', crew_chief.last_name) AS crew_chief_name

    FROM
    
    "Harvesting_Delivery_Ticket" ht
    INNER JOIN "Customer_Job_Setup" cjs ON ht.job_id = cjs."id"
    INNER JOIN "Employees" truck_driver ON ht.truck_driver_id = truck_driver.ID
    INNER JOIN "Employees" kart_operator ON ht.kart_operator_id = kart_operator.ID 
    INNER JOIN "Employees" crew_chief ON cjs.crew_chief_id = crew_chief.id
    INNER JOIN "Customers" CUS ON CUS."id" = ht.customer_id
    INNER JOIN "Customer_Farm" farm ON ht.farm_id = farm."id"
    INNER JOIN "Customer_Field" field ON ht.field_id = field."id" 
    LEFT JOIN "Customer_Field" splitfield ON ht.split_field_id = splitfield."id"::VARCHAR
    INNER JOIN "Crops" crops ON ht.crop_id = crops."id"::VARCHAR
    LEFT JOIN "Motorized_Vehicles" mv ON ht.machinery_id = mv.id::VARCHAR

  WHERE
  ${whereClause}

  order by ht.delivery_ticket_name DESC
  LIMIT ${limit}
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