import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { NonMotorized } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const non_motorized: NonMotorized = req.body;
    let query = `
    UPDATE 
          "Non_Motorized_Vehicles"
    SET 
    "id"                      = '${non_motorized.id}', 
    "type"                    = '${non_motorized.type}', 
    "color"                   = '${non_motorized.color}', 
    "year"                    = '${non_motorized.year}', 
    "make"                    = '${non_motorized.make}', 
    "model"                   = '${non_motorized.model}', 
    "title"                   = '${non_motorized.title}', 
    "license"                 = '${non_motorized.license}', 
    "registration"            = '${non_motorized.registration}', 
    "insurance_status"        = '${non_motorized.insurance_status}', 
    "liability"               = '${non_motorized.liability}', 
    "collision"               = '${non_motorized.collision}', 
    "comprehensive"           = '${non_motorized.comprehensive}', 
    "purchase_price"          = '${non_motorized.purchase_price}', 
    "date_of_purchase"        = '${non_motorized.date_of_purchase}', 
    "sales_price"             = '${non_motorized.sales_price}', 
    "date_of_sales"           = '${non_motorized.date_of_sales}', 
    "estimated_market_value"  = '${non_motorized.estimated_market_value}', 
    "source_of_market_value"  = '${non_motorized.source_of_market_value}', 
    "date_of_market_value"    = '${non_motorized.date_of_market_value}',  
    "vin_number"              = '${non_motorized.vin_number}',
    "company_id"              = '${non_motorized.company_id}',
    "name"                    = '${non_motorized.name}',
    "license_plate"           = '${non_motorized.license_plate}',
    "pictures"                = '${non_motorized.pictures}',
    "status"                  = '${non_motorized.status}'

    WHERE 
          "id" = '${non_motorized.id}';`
    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Non Motorized Vehicle has been updated successfully.",
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
