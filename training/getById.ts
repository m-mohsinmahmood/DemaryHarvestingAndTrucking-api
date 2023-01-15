import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const trainee_id: string = req.query.trainee_id;
    const trainer_id: string = req.query.trainer_id;
let getById;
    if(trainee_id){
      getById = `
      SELECT 
      emp.first_name as "first_name",
              emp.last_name as "last_name",
              emp."id" as "trainee_id"
      FROM 
            "Employees" emp
      WHERE 
            "id" = '${trainee_id}';
        `;
    }else{
      getById = `
      SELECT 
             concat(emp.first_name,' ' ,emp.last_name)	as "trainer_name",
              emp."id" as "trainer_id",
              emp."town_city" as "town_city",
              emp."state" as "state"
      FROM 
            "Employees" emp
      WHERE 
            "id" = '${trainer_id}';
        `;
    }

    db.connect();
    console.log(getById)

    let result = await db.query(getById);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No trainer exists with this id.",
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
