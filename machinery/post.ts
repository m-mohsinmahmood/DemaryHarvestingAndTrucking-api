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
      INSERT INTO 
                  "Machinery" 
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
                    "vin_number",
                    "name",
                    "license_plate",
                    "pictures",
                    "status"
                  )
                  
      VALUES      (
                  '${machinery.type}', 
                  '${machinery.company_id}', 
                  '${machinery.color}', 
                  '${machinery.year}', 
                  '${machinery.make}', 
                  '${machinery.model}', 
                  '${machinery.title}', 
                  '${machinery.license}',
                  '${machinery.registration}',
                  '${machinery.insurance_status}',
                  '${machinery.liability}',
                  '${machinery.collision}',
                  '${machinery.comprehensive}',
                  '${machinery.purchase_price}',
                  '${machinery.date_of_purchase}',
                  '${machinery.sales_price}',
                  '${machinery.date_of_sales}',
                  '${machinery.estimated_market_value}',
                  '${machinery.source_of_market_value}',
                  '${machinery.date_of_market_value}',
                  '${machinery.vin_number}',
                  '${machinery.name}',
                  '${machinery.license_plate}',
                  '${machinery.pictures}',
                  '${machinery.status}'
                  );
    `;

    db.connect();
    await db.query(query);
    db.end();
    console.log(query);

    context.res = {
      status: 200,
      body: {
        message: "Machinery has been created successfully",
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
