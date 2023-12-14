import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_id: string = req.query.customerId;
    const sort: string = req.query.sort ? req.query.sort : `cr."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = `WHERE cr."customer_id" = '${customer_id}'`;

    let combining_rates_query = `
        SELECT 
                cr."id",
                cf."id" AS "farm_id",
			          cf."name" AS "farm_name",
                c."id" as "crop_id",
                CONCAT (c."name", ' (', c."variety", ')') AS "crop_name",
                c."bushel_weight", 
                cr."customer_id", 
                cr."combining_rate", 
                cr."base_bushels", 
                cr."premium_rate",
                cr."combining_fuel_cost",
                cr."tractor_fuel_cost"
               
        FROM 
                "Combining_Rates" cr 
                INNER JOIN "Crops" c ON cr."crop_id" = c."id" AND cr."is_deleted" = false
                INNER JOIN "Customer_Farm" cf ON cr.farm_id = cf."id" AND cf."is_deleted" = FALSE
                INNER JOIN "Customers" cus ON cr.customer_id = cus."id"

        ${whereClause}
        ORDER BY 
              ${sort} ${order}
      ;`;

      let notes = ` SELECT 
      cus."combiningRateNote",
      cus."haulingRateNote"
      
      FROM 
      "Combining_Rates" cr 
      INNER JOIN "Crops" c ON cr."crop_id" = c."id" AND cr."is_deleted" = false
      INNER JOIN "Customer_Farm" cf ON cr.farm_id = cf."id" AND cf."is_deleted" = FALSE
      INNER JOIN "Customers" cus ON cr.customer_id = cus."id"

      ${whereClause}
      ;`;


    let query = `${combining_rates_query} ${notes}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      combining_rates: result[0].rows,
      notes:result[1].rows
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
