import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { rentals } from "./model";
// import { cropValidator } from "./validator";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {    
    //#region Validation
    const rentals: rentals = req.body;
    // const error = cropValidator(crop);
    // if (error.length > 0) throw { message: error };
    //#endregion
    //#region Query Execution
    let query = `
        INSERT INTO 
                  "Rental_Invoice" 
                  (
                    "created_at",
                    "rental_type",
                    "quantity_type",
                    "quantity",
                    "rate",
                    "amount",
                    "customer_id"
                  )
        VALUES 
                  ('${rentals.date}', 
                  '${rentals.rental_type}', 
                  '${rentals.quantity_type}', 
                  '${rentals.quantity}', 
                  '${rentals.rate}', 
                  '${rentals.amount}', 
                  '${rentals.customer_id}'
                 );
    `;
    db.connect();
    await db.query(query);
    db.end();
    //#endregion
    //#region Success Response
    context.res = {
      status: 200,
      body: {
        message: "Invoice has been successfully created",
      },
    };
    context.done();
    return;
    //#endregion
  } catch (error) {
    //#region Error Response
    db.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    context.done();
    return;
    //#endregion
  }
};

export default httpTrigger;
