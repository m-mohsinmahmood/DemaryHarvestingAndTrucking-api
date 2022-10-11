import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { customer_farm_field } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_farm_field: customer_farm_field = req.body;

    let farmQuery = `
    INSERT INTO 
                "Customer_Farm" 
                ("name", 
                "customer_id") 

    VALUES 
                ('${customer_farm_field.farm}', 
                '${customer_farm_field.customer_id}')
    `;
    
    let fieldQuery = ``;

    customer_farm_field.fields.forEach(field => {
      fieldQuery = fieldQuery + `
      INSERT INTO 
                  "Customer_Field" 
                  ("name", 
                  "customer_id", 
                  "farm_id",
                  "acres",
                  "calendar_year") 
       
      VALUES 
                  (
                  '${field.name}', 
                  '${customer_farm_field.customer_id}', 
                  farm_id,
                  ${field.acres},
                  TO_DATE('${field.calendar_year}', 'YYYY/MM/DD')
                  );
      `;
    });
    

    let query = `
    DO $$
    DECLARE
       farm_id uuid;
    
    BEGIN
       
      ${farmQuery}
      RETURNING "id" INTO farm_id;
      ${fieldQuery}
    
    END $$;
    `

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Customer farm & fields have been created successfully",
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
