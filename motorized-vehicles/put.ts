import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { Motorized } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const motorized: Motorized = req.body;
    let query = `
    UPDATE 
          "Motorized_Vehicles"
    SET 
    "id"                      = '${motorized.id}', 
    "type"                    = '${motorized.type}', 
    "color"                   = '${motorized.color}', 
    "year"                    = '${motorized.year}', 
    "make"                    = '${motorized.make}', 
    "odometer_reading_start"  = '${motorized.odometer_reading_start}',
    "odometer_reading_end"    = '${motorized.odometer_reading_end}',
    "model"                   = '${motorized.model}', 
    "title"                   = '${motorized.title}', 
    "license"                 = '${motorized.license}', 
    "registration"            = '${motorized.registration}', 
    "insurance_status"        = '${motorized.insurance_status}', 
    "liability"               = '${motorized.liability}', 
    "collision"               = '${motorized.collision}', 
    "comprehensive"           = '${motorized.comprehensive}', 
    "purchase_price"          = '${motorized.purchase_price}', 
    "date_of_purchase"        = '${motorized.date_of_purchase}', 
    "sales_price"             = '${motorized.sales_price}', 
    "date_of_sales"           = '${motorized.date_of_sales}', 
    "estimated_market_value"  = '${motorized.estimated_market_value}', 
    "source_of_market_value"  = '${motorized.source_of_market_value}', 
    "date_of_market_value"    = '${motorized.date_of_market_value}',  
    "vin_number"              = '${motorized.vin_number}',
    "company_id"              = '${motorized.company_id}',
    "name"                    = '${motorized.name}',
    "license_plate"           = '${motorized.license_plate}',
    "status"                  = '${motorized.status}'

    WHERE 
          "id" = '${motorized.id}';`
    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Motorized Vehicle has been updated successfully.",
      },
    };
    context.done();
    return;
  } catch (error) {
    db.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    return;
  }
};

export default httpTrigger;
