import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const non_motorized_id: string = req.query.id;

    let non_motorized_info_query = `
        SELECT 
              "id", 
              "type", 
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
              "company_id",
              "name",
              "license_plate",
              "pictures",
              "status"
        FROM 
              "Non_Motorized_Vehicles"
        WHERE 
              "id" = '${non_motorized_id}';
      `;

    db.connect();

    let result = await db.query(non_motorized_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No Non Motorized Vehicle exists with this id.",
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
