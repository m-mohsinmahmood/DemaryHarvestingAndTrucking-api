import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const work_order_id: string = req.query.work_order_id;

    let getById = `
    SELECT 
    customer."customer_name" as "customer_name",
            emp."first_name" as "dispatcher_first_name",
    emp."last_name" as "dispatcher_last_name",
            emp2."first_name" as "truck_driver_first_name",
    emp2."last_name" as "truck_driver_last_name",
            farm."name" as "farm_name",
            field."name" as "field_name",
            fwo.field_address as "field_address",
            fwo.customer_phone as "customer_phone",
            machinery."name" as "machinery_name"
            
   FROM 
         "Farming_Work_Order" fwo
                       INNER JOIN "Customers" customer 
        ON fwo."customer_id" = customer."id"
                    
                    INNER JOIN "Employees" emp
            ON fwo.dispatcher_id = emp."id"
                    
                    INNER JOIN "Employees" emp2
            ON fwo.tractor_driver_id = emp2."id"
                    
                    INNER JOIN "Customer_Farm" farm 
        ON fwo."farm_id" = farm."id"
                    
                    INNER JOIN "Customer_Field" field 
ON fwo."field_id" = field."id"
   
   INNER JOIN "Machinery" machinery
   ON fwo.machinery_id = machinery."id"
   WHERE 
        fwo."id" = '${work_order_id}';
      `;

    db.connect();

    console.log(getById);
    let result = await db.query(getById);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No Word order exists with this id.",
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
