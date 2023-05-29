import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const driverIds: string = req.query.driverIds;
  const kartOperatorId: string = req.query.kartOperatorId;

  try {

    let query = `
    DELETE 

    FROM
        "Customer_Job_Assigned_Roles" 
    WHERE
        ( employee_id ) IN (

        SELECT
            '${driverIds}' AS employee_id 
        FROM
            "Customer_Job_Setup" cjs
            INNER JOIN "Employees" crew_chief ON crew_chief."id" = cjs.crew_chief_id 
        WHERE
            cjs.crew_chief_id :: VARCHAR = ( SELECT dht_supervisor_id :: VARCHAR FROM "Employees" WHERE ID = '${kartOperatorId}' ) 
        );
      `;

    console.log(query);

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Employee has been assigned as a Truck Driver.",
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
