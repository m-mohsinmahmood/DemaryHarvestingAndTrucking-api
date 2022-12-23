import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let ticket_info_query = ``;
  try {
    const ticket_id: string = req.query.id;
    const entity: string = req.query.entity;
    console.log('Entity in GET-ID',entity);
    console.log('Ticket ID',ticket_id);
    if (entity === "ticket") {
      ticket_info_query = `
          
          SELECT * FROM "Harvesting_Ticket"
      WHERE 
              "delivery_ticket_number" = '${ticket_id}';
          `;
    } 
    else if(entity === "verify-ticket-truck") {
      ticket_info_query = `
      SELECT 
		 farm."name" as "farm_name",
		 farm."id" as "farm_id",
		 crop."name" as "crop_name",
		 crop."id" as "crop_id",
		 field."name" as "field_name",
		 field."id" as "field_id",
		 emp.first_name as "first_name",
		 emp.last_name as "last_name",
		 wo.destination as "destination",
		 wo.split_load as "split_load",
		 wo.truck_driver_company as "truck_driver_company",
		 wo.delivery_ticket_number as "delivery_ticket_number",
		 wo.kart_scale_weight_split as "kart_scale_weight_split",
		 wo.truck_id as "truck_id",
		 wo.field_load_split as "field_load_split",
		 wo.loaded_miles as "loaded_miles",
		 wo.kart_scale_weight as "kart_scale_weight",
		 wo.kart_scale_weight_split as "kart_scale_weight_split",
		 cus.customer_name as "customer_name"
    FROM 
    
		"Harvesting_Ticket" wo

    INNER JOIN "Customer_Farm" farm 
    ON wo."farm_id" = farm."id"
		
		INNER JOIN "Crops" crop 
    ON wo."crop_id" = crop."id"
		
		INNER JOIN "Customer_Field" field 
    ON wo."field_id" = field."id"
		
		INNER JOIN "Employees" emp 
    ON wo."truck_driver_id" = emp."id"
		
		INNER JOIN "Customers" cus 
    ON wo."customer_id" = cus."id"
		
		WHERE             
    "delivery_ticket_number" = '${ticket_id}';`;
    }else {
      ticket_info_query = `
      SELECT 
		 farm."name" as "farm_name",
		 farm."id" as "farm_id",
		 crop."name" as "crop_name",
		 crop."id" as "crop_id",
		 field."name" as "field_name",
		 field."id" as "field_id",
		 emp.first_name as "first_name",
		 emp.last_name as "last_name",
		 wo.destination as "destination",
		 wo.split_load as "split_load",
		 wo.truck_driver_company as "truck_driver_company",
		 wo.delivery_ticket_number as "delivery_ticket_number",
		 wo.kart_scale_weight_split as "kart_scale_weight_split",
		 wo.truck_id as "truck_id",
		 wo.field_load_split as "field_load_split",
		 wo.loaded_miles as "loaded_miles",
		 wo.kart_scale_weight as "kart_scale_weight",
     wo.scale_ticket_weight as "scale_ticket_weight",
     wo.moisture_content as "moisture_content",
     wo.scale_ticket as "scale_ticket",
		 cus.customer_name as "customer_name"
    FROM 
    
		"Harvesting_Ticket" wo

    INNER JOIN "Customer_Farm" farm 
    ON wo."farm_id" = farm."id"
		
		INNER JOIN "Crops" crop 
    ON wo."crop_id" = crop."id"
		
		INNER JOIN "Customer_Field" field 
    ON wo."field_id" = field."id"
		
		INNER JOIN "Employees" emp 
    ON wo."truck_driver_id" = emp."id"
		
		INNER JOIN "Customers" cus 
    ON wo."customer_id" = cus."id"
		
		WHERE             
    "delivery_ticket_number" = '${ticket_id}';`;
    }

    db.connect();

    let result = await db.query(ticket_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No ticket exists with this id.",
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
