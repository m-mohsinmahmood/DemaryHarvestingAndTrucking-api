import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const crew_chief_id: string = req.query.crew_chief_id;
  const role: string = req.query.role;
  const employee_id: string[] = req.query.employee_id.split(',');

  try {

    let query = `
    DELETE FROM "Harvesting_Assigned_Roles"
    WHERE
        employee_id IN ('${employee_id.join("','")}')
        AND crew_chief_id = '${crew_chief_id}'
        AND role = '${role}';
`;

    console.log(query);

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "",
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
