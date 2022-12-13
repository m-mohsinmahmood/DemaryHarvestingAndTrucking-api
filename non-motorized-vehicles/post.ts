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
      INSERT INTO 
                  "Non_Motorized_Vehicles" 
                  (
                    "type", 
                    "company_id", 
                    "color", 
                    "year", 
                    "make", 
                    "model", 
                    "title", 
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
                    "vin_number"
                    "name",
                    "license_plate",
                    "pictures",
                    "status"
                  )
                  
      VALUES      (
                  '${non_motorized.type}', 
                  '${non_motorized.company_id}', 
                  '${non_motorized.color}', 
                  '${non_motorized.year}', 
                  '${non_motorized.make}', 
                  '${non_motorized.model}', 
                  '${non_motorized.title}', 
                  '${non_motorized.license}',
                  '${non_motorized.registration}',
                  '${non_motorized.insurance_status}',
                  '${non_motorized.liability}',
                  '${non_motorized.collision}',
                  '${non_motorized.comprehensive}',
                  '${non_motorized.purchase_price}',
                  '${non_motorized.date_of_purchase}',
                  '${non_motorized.sales_price}'
                  '${non_motorized.date_of_sales}',
                  '${non_motorized.estimated_market_value}',
                  '${non_motorized.source_of_market_value}',
                  '${non_motorized.date_of_market_value}',
                  '${non_motorized.vin_number}',
                  '${non_motorized.name}',
                  '${non_motorized.license_plate}',
                  '${non_motorized.pictures}',
                  '${non_motorized.status}'
                  );
    `;

    db.connect();
    await db.query(query);
    db.end();
    console.log(query);

    context.res = {
      status: 200,
      body: {
        message: "Non Motorized Vehicle has been created successfully",
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
