import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const crew_chief_id = req.query.crew_chief_id;

  try {
    let whereClause: string = ` WHERE "is_deleted" = false`;

    let assigned_roles_info_query = `
    Select 

    SUM(CASE WHEN "role" Like '%Combine Operator%' THEN 1 ELSE 0 END) as combine_operator,
    SUM(CASE WHEN "role" Like '%Cart Operator%' THEN 1 ELSE 0 END) as cart_operator
    
    From "Employees"
    
    Where dht_supervisor_id = '${crew_chief_id}'
    AND (role LIKE '%Combine Operator%' OR role Like '%Cart Operator%')
    ;
      `;

    let assigned_roles_info_query_count = `
        Select 

        id,
        first_name,
        last_name,
        "role" 
    
        From "Employees"
    
        Where dht_supervisor_id = '${crew_chief_id}'
        AND (role LIKE '%Combine Operator%' OR role Like '%Cart Operator%');
      `;

    let query = `${assigned_roles_info_query} ${assigned_roles_info_query_count}`;
    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      assigned_roles: result[0].rows,
      employees: result[1].rows,
      status: 200,
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
