import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_id: string = req.query.id;

    let customer_info_query = `
        SELECT 
              "id", 
              "customer_name", 
              "main_contact", 
              "position", 
              "phone_number", 
              "state", 
              "country", 
              "email", 
              "customer_type", 
              "status",
              "customer_name",
              "fax",
              "address",
              "billing_address",
              "city",
              "zip_code",
              "website",
              "linkedin",
              "notes"
        FROM 
              "Customers"
        WHERE 
              "id" = '${customer_id}';
      `;

    db.connect();

    let result = await db.query(customer_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No customer exists with this id.",
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
