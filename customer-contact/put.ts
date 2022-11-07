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
        UPDATE  "Customer_Contacts"
        SET     "company_name"  = '${customer_contact.company_name}', 
                "first_name"    = '${customer_contact.first_name}', 
                "last_name"     = '${customer_contact.last_name}',
                "position"      = '${customer_contact.position}', 
                "website"       = '${customer_contact.website}', 
                "address"       = '${customer_contact.address}', 
                "cell_number"   = '${customer_contact.cell_number}',
                "city"          = '${customer_contact.city}', 
                "office_number" = '${customer_contact.office_number}', 
                "state"         = '${customer_contact.state}', 
                "email"         = '${customer_contact.email}', 
                "zip_code"      = '${customer_contact.zip_code}', 
                "fax"           = '${customer_contact.fax}', 
                "linkedin"      = '${customer_contact.linkedin}', 
                "note_1"        = '${customer_contact.note_1}', 
                "note_2"        = '${customer_contact.note_2}', 
                "avatar"        = '${customer_contact.avatar}' 
        WHERE   "id"            = '${customer_contact.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer contact has been updated successfully.",
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
