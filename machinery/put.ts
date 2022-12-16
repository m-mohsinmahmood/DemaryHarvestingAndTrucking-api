import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { machinery } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const machinery: machinery = req.body;
    let query = `
    UPDATE 
          "Machinery"
    SET 
    "id"                      = '${machinery.id}', 
    "type"                    = '${machinery.type}', 
    "color"                   = '${machinery.color}', 
    "year"                    = '${machinery.year}', 
    "make"                    = '${machinery.make}', 
    "model"                   = '${machinery.model}', 
    "title"                   = '${machinery.title}', 
    "license"                 = '${machinery.license}', 
    "registration"            = '${machinery.registration}', 
    "insurance_status"        = '${machinery.insurance_status}', 
    "liability"               = '${machinery.liability}', 
    "collision"               = '${machinery.collision}', 
    "comprehensive"           = '${machinery.comprehensive}', 
    "purchase_price"          = '${machinery.purchase_price}', 
    "date_of_purchase"        = '${machinery.date_of_purchase}', 
    "sales_price"             = '${machinery.sales_price}', 
    "date_of_sales"           = '${machinery.date_of_sales}', 
    "estimated_market_value"  = '${machinery.estimated_market_value}', 
    "source_of_market_value"  = '${machinery.source_of_market_value}', 
    "date_of_market_value"    = '${machinery.date_of_market_value}',  
    "vin_number"              = '${machinery.vin_number}',
    "company_id"              = '${machinery.company_id}',
    "name"                    = '${machinery.name}',
    "license_plate"           = '${machinery.license_plate}',
    "pictures"                = '${machinery.pictures}',
    "status"                  = '${machinery.status}'

    WHERE 
          "id" = '${machinery.id}';`
    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Machinery has been updated successfully.",
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
