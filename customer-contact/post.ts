import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { customer_contact } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_contact: customer_contact = req.body;

    let query = `
    INSERT INTO  
                "Customer_Contacts" 
                ("customer_id", 
                "company_name", 
                "first_name", 
                "last_name", 
                "position", 
                "website", 
                "address", 
                "cell_number", 
                "city", 
                "office_number",
                "state",
                "email",
                "zip_code", 
                "fax", 
                "linkedin", 
                "note_1", 
                "note_2", 
                "avatar")

    VALUES 
                ('${customer_contact.customer_id}', 
                '${customer_contact.company_name}', 
                '${customer_contact.first_name}', 
                '${customer_contact.last_name}',
                '${customer_contact.position}', 
                '${customer_contact.website}', 
                '${customer_contact.address}', 
                '${customer_contact.cell_number}', 
                '${customer_contact.city}',
                '${customer_contact.office_number}',
                '${customer_contact.state}', 
                '${customer_contact.email}', 
                '${customer_contact.zip_code}',
                '${customer_contact.fax}', 
                '${customer_contact.linkedin}', 
                '${customer_contact.note_1}', 
                '${customer_contact.note_2}', 
                '${customer_contact.avatar}'); 
    `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer contact has been created successfully",
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
