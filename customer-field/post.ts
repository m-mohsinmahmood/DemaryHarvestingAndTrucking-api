import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { field, multipleFields } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const fields: multipleFields = req.body;
    let query:string = ``;
    fields.fields.forEach(field => {
      query = query + `
                      INSERT INTO 
                                  "Customer_Field" 
                                  ("customer_id", 
                                  "farm_id",
                                  "name", 
                                  "acres",
                                  "calendar_year",
                                  "status") 
       
                      VALUES 
                                  (
                                  '${fields.customer_id}', 
                                  '${fields.farm_id}',
                                  '${field.name}',
                                  '${field.acres}',
                                  TO_DATE('${field.calendar_year}', 'YYYY/MM/DD'),
                                  ${field.status}
                                  );
                      `;
                    });

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer field/fields has been created successfully",
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
