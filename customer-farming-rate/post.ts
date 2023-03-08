import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { farming_rate } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const farming_rate: farming_rate = req.body;
    
    let query = `
      INSERT INTO 
                  "Farming_Rates" 
                  (
                  "customer_id", 
                  "equipment_type",
                  "rate"
                  ) 
       
      VALUES 
                  (
                  '${farming_rate.customer_id}', 
                  '${farming_rate.equipment_type}',
                   ${farming_rate.rate}
                  );
      `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Farming Rate has been created successfully",
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
