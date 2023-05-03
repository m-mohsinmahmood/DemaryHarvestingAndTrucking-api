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
    const startDate: any = req.query.startDate;
    const endDate: any = req.query.endDate;
    console.log('REQ;',req.query)
let getById;
    if (trainee_id && !(records.evaluation_type === 'summary')) {
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
    } 
    else if (trainer_id && !(records.evaluation_type === 'summary')) {
      getById = `
      SELECT 
             concat(emp.first_name,' ' ,emp.last_name)	as "trainer_name",
             emp."id" as "trainer_id",
             up."city" as "town_city",
             up."state" as "state"
      FROM 
             "Employees" emp LEFT JOIN
             "User_Profile" up ON emp."id" = up.employee_id
      WHERE 
            emp."id" = '${trainer_id}';
        `;
    }
    // to get the training-records by ID having 'pre-trip' check in 'paper-form'
    else if (records.evaluation_form === "paper-form") {
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
      AND evaluation_type = '${records.evaluation_type}'
      AND evaluation_form = 'paper-form';
      `;
    }
    // to get the training-records by ID having 'pre-trip' check in 'digital-form'
    else if (records.evaluation_form === "digital-form") {
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
      AND evaluation_type = '${records.evaluation_type}'
      AND evaluation_form = 'digital-form';
      `;
    } 
    else if (record_id) {
      getById = `
 SELECT * FROM "Training"
WHERE id = '${record_id}';`;
    }
    else if (records.evaluation_type === 'summary'){
getById = `
  SELECT
    "evaluation_type",
    COUNT(CASE WHEN "preTripEvaluation" > 80 THEN 1 END) AS "preTripSatisfactoryCount", 
    COUNT(CASE WHEN "preTripEvaluation" < 80 THEN 1 END) AS "preTripUnSatisfactoryCount",
    COUNT(CASE WHEN "basicSkillEvaluation" <= 24 THEN 1 END) AS "basicSkillsSatisfactoryCount", 
    COUNT(CASE WHEN "basicSkillEvaluation" > 24 THEN 1 END) AS "basicSkillsUnSatisfactoryCount",
    COUNT(CASE WHEN "finalResultRoadSkills" = 'true'  THEN 1 END) AS "roadSkillsSatisfactoryCount", 
    COUNT(CASE WHEN "finalResultRoadSkills" = 'false' THEN 1 END) AS "roadSkillsUnSatisfactoryCount",
    SUM("preTripTime") AS "preTripTime",
    SUM("basicSkillTime") AS "basicSkillTime",
    SUM("roadSkillTime") AS "roadSkillTime"
  FROM (
    SELECT 
      trainee_id, 
      evaluation_type, 
      evaluation_form,
      (
        CAST(ROUND(CAST("percentageEngineCompartment" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("percentageInCab" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("percentageVehicleExternal" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("percentageCoupling" AS NUMERIC), 2) AS NUMERIC)
      ) / 4 AS "preTripEvaluation",
      (
        CAST(ROUND(CAST("pullUpsInput_slb" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroachInput_slb" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("pullUpsInput_ad" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroachInput_ad" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("pullUpsInput_ad90" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroachInput_ad90" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroach_osb" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("pullUps_osb" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("pullUps_pb" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroach_pb" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("pullUps_ps" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroach_ps" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("pullUps_cou" AS NUMERIC), 2) AS NUMERIC) +
        CAST(ROUND(CAST("encroach_cou" AS NUMERIC), 2) AS NUMERIC) 
      ) AS "basicSkillEvaluation",
      "finalResultRoadSkills",
      ("endDatePreTrip" - "created_at") as "preTripTime",
      ("endDateBasicSkill" - "created_at") as "basicSkillTime",
      ("endDateRoadSkill" - "created_at") as "roadSkillTime"
    FROM 
      "Training"
    WHERE 
      trainee_id = '${records.trainee_record_id}' AND evaluation_form = 'digital-form' AND created_at >= '${startDate}' AND created_at<= '${endDate}'
  ) AS percentages
  GROUP BY evaluation_type, trainee_id, evaluation_type;
`;
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
