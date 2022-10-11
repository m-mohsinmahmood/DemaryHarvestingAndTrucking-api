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
      INSERT INTO 
                  "Customers" 
                  ("company_name", 
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
                  "linkedin")
      VALUES      ('${customer.company_name}', 
                  '${customer.main_contact}', 
                  '${customer.position}', 
                  '${customer.phone_number}', 
                  '${customer.state}', 
                  '${customer.country}', 
                  '${customer.email}', 
                  '${customer.customer_type}', 
                  '${customer.status}',
                  '${customer.customer_name}',
                  '${customer.fax}',
                  '${customer.address}',
                  '${customer.billing_address}',
                  '${customer.city}',
                  '${customer.zip_code}',
                  '${customer.website}',
                  '${customer.linkedin}');
    `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer has been created successfully",
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
