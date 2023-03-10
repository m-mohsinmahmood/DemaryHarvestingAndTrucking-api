import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  
  console.log("Get Crew");
  
  console.log(req.query);
  
  const employeeId: string = req.query.employeeId;
  
  try {
    
    let whereClause: string = ` AND "is_deleted" = false`;

    let getKartOperatorCrew = `
    select dht_supervisor_id as id from "Employees" where id = '${employeeId}'

        ${whereClause};
      `;

    let query = `${getKartOperatorCrew}`;
    console.log(query);
    

    db.connect();

    let result = await db.query(query);

    let resp = result.rows;

    db.end();

    context.res = {
      status: 200,
      body: resp
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
