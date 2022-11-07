import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const search: string = req.query.search;
    const customer_id: string = req.query.customerId;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : ` "created_at"`;
    const order: string = req.query.order ? req.query.order : ` desc`;
    let whereClause: string = ` WHERE "customer_id" = '${customer_id}' AND "is_deleted" = false`;

    if (search)
      whereClause = whereClause + ` AND LOWER("last_name") LIKE LOWER('%${search}%')`;

    let customer_contact_info_query = `
        SELECT 
              "id",
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
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${(page - 1) * limit}
        LIMIT 
              ${limit};
      `;

    let customer_contact_count_query = `
        SELECT 
              COUNT("id")
        FROM   
              "Customer_Contacts"
        ${whereClause};
      `;

    let query = `${customer_contact_info_query} ${customer_contact_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      customer_contacts: result[0].rows,
      count: +result[1].rows[0].count,
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
