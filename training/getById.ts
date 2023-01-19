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
    const records: any = req.query;
    const record_id: any = req.query.record_id;
    console.log('REQ;',req.query)
let getById;
    if (trainee_id) {
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
    } else if (trainer_id) {
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
    // to get the training-records by ID having 'pre-trip' check in 'paper-form'
    else if (
      records.evaluation_type === "pre-trip" &&
      records.evaluation_form === "paper-form"
    ) {
      getById = `
      SELECT 
      trn.is_completed_cdl_classroom as "is_completed_cdl_classroom",
      trn.is_completed_group_practical as "is_completed_group_practical",
      trn.evaluation_form as "evaluation_form",
      trn.evaluation_type as "evaluation_type",
      trn."id" as "record_id",
      trn."created_at" as "created_at",
      concat(emp_trainee.first_name,' ' ,emp_trainee.last_name)	as "trainee_name",
      emp_trainee.id as "trainee_id",
      concat(emp_trainer.first_name,' ' ,emp_trainer.last_name)	as "trainer_name",
      emp_trainer.id as "trainer_id"

      FROM "Training" trn

      INNER JOIN "Employees" emp_trainee
		  ON trn.trainee_id = emp_trainee."id"
		  INNER JOIN "Employees" emp_trainer
		  ON trn.trainer_id = emp_trainer."id"
      WHERE trainee_id = '${records.trainee_record_id}'
      AND evaluation_type = 'pre-trip'
      AND evaluation_form = 'paper-form';
      `;
    }
    // to get the training-records by ID having 'pre-trip' check in 'digital-form'
    else if (
      records.evaluation_type === "pre-trip" &&
      records.evaluation_form === "digital-form"
    ) {
      getById = `
      SELECT 
      trn.is_completed_cdl_classroom as "is_completed_cdl_classroom",
      trn.is_completed_group_practical as "is_completed_group_practical",
      trn.evaluation_form as "evaluation_form",
      trn.evaluation_type as "evaluation_type",
      trn."id" as "record_id",

      concat(emp_trainee.first_name,' ' ,emp_trainee.last_name)	as "trainee_name",
      emp_trainee.id as "trainee_id",
      concat(emp_trainer.first_name,' ' ,emp_trainer.last_name)	as "trainer_name",
      emp_trainer.id as "trainer_id"

      FROM "Training" trn

      INNER JOIN "Employees" emp_trainee
		  ON trn.trainee_id = emp_trainee."id"
		  INNER JOIN "Employees" emp_trainer
		  ON trn.trainer_id = emp_trainer."id"
      WHERE trainee_id = '${records.trainee_record_id}'
      AND evaluation_type = 'pre-trip'
      AND evaluation_form = 'digital-form';
      `;
    } else if (record_id) {
      getById = `
 SELECT * FROM "Training"
WHERE id = '${record_id}';`;
    }

    db.connect();
    console.log(getById)

    let result = await db.query(getById);
    // let resp;
    // if (result.rows.length > 0) resp = result.rows[0];
    let resp;
    if (result.rows.length > 0) resp = result.rows;
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
