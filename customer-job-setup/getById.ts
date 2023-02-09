import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const job_id: string = req.query.job_id;
    console.log("Req:", job_id);

    let getById = `
 SELECT 
 customer."id" as "customer_id", 
 wo."state" as "state",
 wo."employee_id" as "employee_id",
 wo."id" as "job_id",
 wo."total_acres" as "total_acres",
     wo."total_gps_acres" as "total_gps_acres",
 customer."customer_name" as "customer_name",
     farm."name" as "farm_name",
     farm."id" as "farm_id",
      crop."name" as "crop_name",
      crop."id" as "crop_id",
      field."name" as "field_name",
      field."id" as "field_id",
      emp."first_name" as "first_name",
      emp."last_name" as "last_name"
    FROM 
    
		"Customer_Job_Setup" wo
		
    INNER JOIN "Customers" customer 
    ON wo."customer_id" = customer."id"

    INNER JOIN "Customer_Farm" farm 
    ON wo."farm_id" = farm."id"
		
		INNER JOIN "Crops" crop 
    ON wo."crop_id" = crop."id"
		
		INNER JOIN "Customer_Field" field 
    ON wo."field_id" = field."id"

    INNER JOIN "Employees" emp
		ON wo.employee_id = emp."id"
		WHERE
		wo."id" = '${job_id}'
;`;

    db.connect();
    console.log(getById);
    let result = await db.query(getById);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No customer exists with this id.",
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
