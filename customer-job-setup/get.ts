import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const entity: string = req.query.entity;

  try {
    let job_setup_query =``;
    // to get the opened/not-closed jobs of crew chief
    if(entity === 'crew-chief'){
  job_setup_query =`
 SELECT 
    customer."id" as "customer_id", 
    wo."state" as "state",
		wo."is_close" as "is_close_crew",
    customer."customer_name" as "customer_name",
		 farm."name" as "farm_name",
		 farm."id" as "farm_id",
		 crop."name" as "crop_name",
		 crop."id" as "crop_id",
		 field."name" as "field_name",
		 field."id" as "field_id"
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
		WHERE
		"is_close" = FALSE
`;
    }
        // to get the opened/not-closed jobs of combine operator
    else if (entity === 'combine-operator'){
      job_setup_query =`
      SELECT 
         customer."id" as "customer_id", 
         wo."state" as "state",
         wo."is_close_combine" as "is_close_combine",
         customer."customer_name" as "customer_name",
          farm."name" as "farm_name",
          farm."id" as "farm_id",
          crop."name" as "crop_name",
          crop."id" as "crop_id",
          field."name" as "field_name",
          field."id" as "field_id"
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
         WHERE
         "is_close_combine" = FALSE
     `;
    }
        // to get the opened/not-closed jobs of kart operator
    else if (entity === 'kart-operator'){
      job_setup_query =`
      SELECT 
         customer."id" as "customer_id", 
         wo."state" as "state",
         wo."is_close_kart" as "is_close_kart",
         customer."customer_name" as "customer_name",
          farm."name" as "farm_name",
          farm."id" as "farm_id",
          crop."name" as "crop_name",
          crop."id" as "crop_id",
          field."name" as "field_name",
          field."id" as "field_id"
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
         WHERE
         "is_close_kart" = FALSE
     `;
    }
    //  job_setup_query = `
    // SELECT 
    // customer."id" as "customer_id", 
    // wo."state" as "state", 
    // customer."customer_name" as "customer_name",
		//  farm."name" as "farm_name",
		//  farm."id" as "farm_id",
		//  crop."name" as "crop_name",
		//  crop."id" as "crop_id",
		//  field."name" as "field_name",
		//  field."id" as "field_id"
    // FROM 
    
		// "Customer_Job_Setup" wo
		
    // INNER JOIN "Customers" customer 
    // ON wo."customer_id" = customer."id"

    // INNER JOIN "Customer_Farm" farm 
    // ON wo."farm_id" = farm."id"
		
		// INNER JOIN "Crops" crop 
    // ON wo."crop_id" = crop."id"
		
		// INNER JOIN "Customer_Field" field 
    // ON wo."field_id" = field."id"
    //   `;

    let query = `${job_setup_query}`;
    db.connect();

    let result = await db.query(query);

    let resp = {
      customer_job: result.rows
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
