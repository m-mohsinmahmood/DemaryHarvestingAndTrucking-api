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
        UPDATE "Customers"
        SET "company_name" = '${customer.company_name}', "main_contact" = '${customer.main_contact}', "position" = '${customer.position}', "phone_number" = '${customer.phone_number}', "state" = '${customer.state}', "country" = '${customer.country}',
            "email" = '${customer.email}', "customer_type" = '${customer.customer_type}', "status" = '${customer.status}');
        WHERE "id" = '${customer.id}';`

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
