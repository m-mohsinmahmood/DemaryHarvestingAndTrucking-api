import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const machinery_id: string = req.query.id;

    let machinery_info_query = `
        SELECT 
              "id", 
              "type", 
              "color", 
              "year", 
              "make", 
              "model", 
              "serial_number", 
              "engine_hours", 
              "eh_reading", 
              "separator_hours",
              "sh_reading",
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
              "company_id",
              "name",
              "pictures",
              "status"
        FROM 
              "Machinery"
        WHERE 
              "id" = '${machinery_id}';
      `;

    db.connect();

    let result = await db.query(machinery_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No machinery exists with this id.",
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
