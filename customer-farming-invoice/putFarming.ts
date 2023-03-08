import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { farming } from './model';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const farming: farming = req.body;
    let query = `
        UPDATE  "Farming_Invoice"
        SET     "customer_id"     = '${farming.customer_id}', 
                "created_at"            = '${farming.date}',
                "equipment_type"  = '${farming.equipment_type}',
                "quantity_type"   =  '${farming.quantity_type}',
                "quantity"        = '${farming.quantity}', 
                "rate"            = '${farming.rate}',
                "amount"          =  '${farming.amount}'
              
        WHERE   "id"             = '${farming.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Invoice has been updated successfully.",
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
