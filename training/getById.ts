import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import * as moment from "moment";

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
    console.log('REQ;', req.query)
    let getById;
    if (trainee_id && !(records.evaluation_type === 'summary')) {
      getById = `
      SELECT 
      emp.first_name as "first_name",
              emp.last_name as "last_name",
              emp."id" as "trainee_id",
              up."city" as "town_city",
             up."state" as "state"
      FROM 
      "Employees" emp LEFT JOIN
      "User_Profile" up ON emp."id" = up.employee_id
      WHERE 
            emp."id" = '${trainee_id}';
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
      AND evaluation_form = 'digital-form'
      ORDER BY trn."created_at" DESC;
      `;
    }
    else if (record_id) {
      getById = `
 SELECT * FROM "Training"
WHERE id = '${record_id}';`;
    }
    else if (records.evaluation_type === 'summary') {
      getById = `
  SELECT
    "evaluation_type",
    "trainee_name",
    COUNT(CASE WHEN "preTripEvaluation" > 80 THEN 1 END) AS "preTripSatisfactoryCount", 
    COUNT(CASE WHEN "preTripEvaluation" < 80 THEN 1 END) AS "preTripUnSatisfactoryCount",
    COUNT(CASE WHEN "basicSkillEvaluation" <= 24 THEN 1 END) AS "basicSkillsSatisfactoryCount", 
    COUNT(CASE WHEN "basicSkillEvaluation" > 24 THEN 1 END) AS "basicSkillsUnSatisfactoryCount",
    COUNT(CASE WHEN "finalResultRoadSkills" = 'true'  THEN 1 END) AS "roadSkillsSatisfactoryCount", 
    COUNT(CASE WHEN "finalResultRoadSkills" = 'false' THEN 1 END) AS "roadSkillsUnSatisfactoryCount",
    justify_interval(SUM ("preTripTime")) AS "preTripTime",
		justify_interval(SUM ("basicSkillTime")) AS "basicSkillTime",
		justify_interval(SUM ("roadSkillTime")) AS "roadSkillTime"
  FROM (
    SELECT 
      trainee_id, 
      evaluation_type,
      CONCAT ( employee.first_name, ' ', employee.last_name ) AS "trainee_name", 
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
      ("endDatePreTrip" - training."created_at") AS "preTripTime",
      ("endDateBasicSkill" - training."created_at") AS "basicSkillTime",
      ("endDateRoadSkill" - training."created_at") AS "roadSkillTime"
    FROM 
        "Training" training INNER JOIN 
        "Employees" employee ON training."trainee_id" = employee.id
    WHERE 
      trainee_id = '${trainee_id}' AND evaluation_form = 'digital-form' AND training.created_at >= '${startDate}' AND training.created_at<= '${endDate}'
  ) AS percentages
  GROUP BY evaluation_type, trainee_id, evaluation_type, trainee_name;
`;
    }

    db.connect();

    let result = await db.query(getById);
    // let resp;
    // if (result.rows.length > 0) resp = result.rows[0];
    let response;
    if (result.rows.length > 0) response = { summary: result.rows };
    else
      response = {
        message: "No trainer exists with this id.",
      };

    //#region Calculate Intercal sum for BTW RANGE
    const totalDuration = response.summary
      .filter(duration => duration.preTripTime || duration.basicSkillTime)
      .reduce((acc, duration) => {
        if (duration.preTripTime != null) {
          const momentDuration = moment.duration(duration.preTripTime);
          return acc.add(momentDuration);
        }
        if (duration.basicSkillTime != null) {
          const momentDuration = moment.duration(duration.basicSkillTime);
          return acc.add(momentDuration);
        }
      }, moment.duration());

    let resp = Object.assign(response, {
      "BTWRange": {
        days: totalDuration.days(),
        hours: totalDuration.hours(),
        minutes: totalDuration.minutes(),
        seconds: totalDuration.seconds()
      }
    });
    //#endregion

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
