import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  const driverIds: [string] = req.body.driverIds;
  const kartOperatorId: string = req.body.kartOperatorId;
  let in_clause: string = driverIds.map(d => `'${d}'`).join(',');

  try {
    
    let query = `
        UPDATE 
                "Employees"
        SET 
                "dht_supervisor_id"= '${kartOperatorId}'
        WHERE 
                "id" IN (${in_clause});`

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
