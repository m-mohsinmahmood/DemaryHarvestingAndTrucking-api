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
      INSERT INTO 
                  "Motorized_Vehicles" 
                  (
                    "type", 
                    "company_id", 
                    "color", 
                    "year", 
                    "make", 
                    "model", 
                    "title", 
                    "odometer",
                    "odometer_reading",
                    "license", 
                    "registration", 
                    "insurance_status", 
                    "liability", 
                    "collision", 
                    "comprehensive", 
                    "purchase_price", 
                    "date_of_purchase", 
                    "sales_price", 
                    "date_of_sales", 
                    "estimated_market_value", 
                    "source_of_market_value", 
                    "date_of_market_value",  
                    "vin_number",
                    "name",
                    "license_plate",
                    "pictures",
                    "status"
                  )
                  
      VALUES      (
                  '${motorized.type}', 
                  '${motorized.company_id}', 
                  '${motorized.color}', 
                  '${motorized.year}', 
                  '${motorized.make}', 
                  '${motorized.model}', 
                  '${motorized.title}', 
                  '${motorized.odometer}', 
                  '${motorized.odometer_reading}', 
                  '${motorized.license}',
                  '${motorized.registration}',
                  '${motorized.insurance_status}',
                  '${motorized.liability}',
                  '${motorized.collision}',
                  '${motorized.comprehensive}',
                  '${motorized.purchase_price}',
                  '${motorized.date_of_purchase}',
                  '${motorized.sales_price}',
                  '${motorized.date_of_sales}',
                  '${motorized.estimated_market_value}',
                  '${motorized.source_of_market_value}',
                  '${motorized.date_of_market_value}',
                  '${motorized.vin_number}',
                  '${motorized.name}',
                  '${motorized.license_plate}',
                  '${motorized.pictures}',
                  '${motorized.status}'
                  );
    `;

    db.connect();
    await db.query(query);
    db.end();
    console.log(query);

    context.res = {
      status: 200,
      body: {
        message: "Motorized Vehicle has been created successfully",
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
