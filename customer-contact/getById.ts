import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_contact_id: string = req.query.id;

    let customer_contact_info_query = `
      SELECT 
            "customer_id", 
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
            "avatar"
      FROM  
            "Customer_Contacts"
      WHERE  
            "id" = '${customer_contact_id}';
      `;

    db.connect();

    let result = await db.query(customer_contact_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No customer contact exists with this id.",
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
