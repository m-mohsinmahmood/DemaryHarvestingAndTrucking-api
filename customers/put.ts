import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { customer } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer: customer = req.body;
    let query = `
        UPDATE 
              "Customers"
        SET 
              "main_contact"    = '${customer.main_contact}', 
              "position"        = '${customer.position}', 
              "phone_number"    = '${customer.phone_number}', 
              "state"           = '${customer.state}', 
              "country"         = '${customer.country}',
              "email"           = '${customer.email}',
              "customer_type"   = '${customer.customer_type}', 
              "status"          = '${customer.status}',
              "customer_name"   = '${customer.customer_name}',
              "fax"             = '${customer.fax}',
              "address"         = '${customer.address}',
              "billing_address" = '${customer.billing_address}',
              "city"            = '${customer.city}',
              "zip_code"        = '${customer.zip_code}',
              "website"         = '${customer.website}',
              "linkedin"        = '${customer.linkedin}'
        WHERE 
              "id" = '${customer.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer has been updated successfully.",
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
