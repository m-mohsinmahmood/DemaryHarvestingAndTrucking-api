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
training."id" as "id",
training."created_at" as "created_at",
training."satisfactoryRoadTesting" as "satisfactoryRoadTesting",
training."unSatisfactoryRoadTesting" as "unSatisfactoryRoadTesting",
training."satisfactoryStraightLineBacking" as "satisfactoryStraightLineBacking",
training."unSatisfactoryStraightLineBacking" as "unSatisfactoryStraightLineBacking",
training."satisfactoryAlleyDocking" as "satisfactoryAlleyDocking",
training."unSatisfactoryAlleyDocking" as "unSatisfactoryAlleyDocking",
training."satisfactoryOffSetBacking" as "satisfactoryOffSetBacking",
training."unSatisfactoryOffSetBacking" as "unSatisfactoryOffSetBacking",
training."satisfactoryParkingBlind" as "satisfactoryParkingBlind",
training."satisfactoryParkingBlind" as "satisfactoryParkingBlind",
training."unSatisfactoryParkingBlind" as "unSatisfactoryParkingBlind",
training."satisfactoryParkingSight" as "satisfactoryParkingSight",
training."unSatisfactoryParkingSight" as "unSatisfactoryParkingSight",
training."satisfactoryCoupUncoup" as "satisfactoryCoupUncoup",
training."unSatisfactoryCoupUncoup" as "unSatisfactoryCoupUncoup",
training."evaluation_type" as "evaluation_type",
training."percentageEngineCompartment" as "percentageEngineCompartment",
training."percentageInCab" as "percentageInCab",
training."percentageVehicleExternal" as "percentageVehicleExternal",
training."percentageCoupling" as "percentageCoupling",
training."percentageSuspension" as "percentageSuspension",
training."pullUpsInput_slb" as "pullUpsInput_slb",
training."encroachInput_slb" as "encroachInput_slb",
training."goal_slb" as "goal_slb",
training."finalPosition_slb" as "finalPosition_slb",
training."straightLineBacking_slb" as "straightLineBacking_slb",
training."straightLineBakingInput_slb" as "straightLineBakingInput_slb",
training."alleyDocking_slb" as "alleyDocking_slb",
training."alleyDockingInput_slb" as "alleyDockingInput_slb",
training."offSetBacking_slb" as "offSetBacking_slb",
training."offSetBackingInput_slb" as "offSetBackingInput_slb",
training."parallelParkingBlind_slb" as "parallelParkingBlind_slb",
training."parallelParkingBlindInput_slb" as "parallelParkingBlindInput_slb",
training."coupUncoup_slb" as "coupUncoup_slb",
training."coupUncoupInput_slb" as "coupUncoupInput_slb",
training."comments_slb" as "comments_slb",
training."pullUpsInput_ad" as "pullUpsInput_ad",
training."encroachInput_ad" as "encroachInput_ad",
training."goal_ad" as "goal_ad",
training."finalPosition_ad" as "finalPosition_ad",
training."straightLineBacking_ad" as "straightLineBacking_ad",
training."straightLineBakingInput_ad" as "straightLineBakingInput_ad",
training."alleyDocking_ad" as "alleyDocking_ad",
training."alleyDockingInput_ad" as "alleyDockingInput_ad",
training."offSetBacking_ad" as "offSetBacking_ad",
training."offSetBackingInput_ad" as "offSetBackingInput_ad",
training."parallelParkingBlind_ad" as "parallelParkingBlind_ad",
training."parallelParkingBlindInput_ad" as "parallelParkingBlindInput_ad",
training."coupUncoup_ad" as "coupUncoup_ad",
training."coupUncoupInput_ad" as "coupUncoupInput_ad",
training."comments_ad" as "comments_ad",
training."pullUps_osb" as "pullUps_osb",
training."encroach_osb" as "encroach_osb",
training."goal_osb" as "goal_osb",
training."finalPosition_osb" as "finalPosition_osb",
training."straightLineBaking_osb" as "straightLineBaking_osb",
training."straightLineBakingInput_osb" as "straightLineBakingInput_osb",
training."alleyDocking_osb" as "alleyDocking_osb",
training."alleyDockingInput_osb" as "alleyDockingInput_osb",
training."offSetBacking_osb" as "offSetBacking_osb",
training."offSetBackingInput_osb" as "offSetBackingInput_osb",
training."parallelParkingBlind_osb" as "parallelParkingBlind_osb",
training."coupUncoup_osb" as "coupUncoup_osb",
training."coupUncoupInput_osb" as "coupUncoupInput_osb",
training."comments_osb" as "comments_osb",
training."pullUps_pb" as "pullUps_pb",
training."encroach_pb" as "encroach_pb",
training."goal_pb" as "goal_pb",
training."finalPosition_pb" as "finalPosition_pb",
training."straightLineBaking_pb" as "straightLineBaking_pb",
training."straightLineBakingInput_pb" as "straightLineBakingInput_pb",
training."alleyDocking_pb" as "alleyDocking_pb",
training."alleyDockingInput_pb" as "alleyDockingInput_pb",
training."offSetBacking_pb" as "offSetBacking_pb",
training."offSetBackingInput_pb" as "offSetBackingInput_pb",
training."parallelParkingBlind_pb" as "parallelParkingBlind_pb",
training."parallelParkingBlindInput_pb" as "parallelParkingBlindInput_pb",
training."coupUncoup_pb" as "coupUncoup_pb",
training."coupUncoupInput_pb" as "coupUncoupInput_pb",
training."comments_pb" as "comments_pb",
training."pullUps_ps" as "pullUps_ps",
training."encroach_ps" as "encroach_ps",
training."goal_ps" as "goal_ps",
training."finalPosition_ps" as "finalPosition_ps",
training."straightLineBaking_ps" as "straightLineBaking_ps",
training."straightLineBakingInput_ps" as "straightLineBakingInput_ps",
training."alleyDocking_ps" as "alleyDocking_ps",
training."alleyDockingInput_ps" as "alleyDockingInput_ps",
training."offSetBacking_ps" as "offSetBacking_ps",
training."offSetBackingInput_ps" as "offSetBackingInput_ps",
training."parallelParkingBlind_ps" as "parallelParkingBlind_ps",
training."parallelParkingBlindInput_ps" as "parallelParkingBlindInput_ps",
training."coupUncoup_ps" as "coupUncoup_ps",
training."coupUncoupInput_ps" as "coupUncoupInput_ps",
training."comments_ps" as "comments_ps",
training."pullUps_cou" as "pullUps_cou",
training."encroach_cou" as "encroach_cou",
training."goal_cou" as "goal_cou",
training."finalPosition_cou" as "finalPosition_cou",
training."straightLineBacking_cou" as "straightLineBacking_cou",
training."straightLineBackingInput_cou" as "straightLineBackingInput_cou",
training."alleyDocking_cou" as "alleyDocking_cou",
training."alleyDockingInput_cou" as "alleyDockingInput_cou",
training."offSetBacking_cou" as "offSetBacking_cou",
training."offSetBackingInput_cou" as "offSetBackingInput_cou",
training."parallelParkingBlind_cou" as "parallelParkingBlind_cou",
training."parallelParkingBlindInput_cou" as "parallelParkingBlindInput_cou",
training."coupUncoup_cou" as "coupUncoup_cou",
training."coupUncoupInput_cou" as "coupUncoupInput_cou",
training."comments_cou" as "comments_cou",
training."leftTurns" as "leftTurns",
training."leftTurnsInput" as "leftTurnsInput",
training."rightTurns" as "rightTurns",
training."rightTurnsInput" as "rightTurnsInput",
training."intersectionStop" as "intersectionStop",
training."intersectionStopInput" as "intersectionStopInput",
training."intersectionThru" as "intersectionThru",
training."intersectionThruInput" as "intersectionThruInput",
training."interstate" as "interstate",
training."interstateInput" as "interstateInput",
training."urbanBusiness" as "urbanBusiness",
training."urbanBusinessInput" as "urbanBusinessInput",
training."lanceChanges" as "lanceChanges",
training."lanceChangesInput" as "lanceChangesInput",
training."curve" as "curve",
training."curveInput" as "curveInput",
training."roadside" as "roadside",
training."roadsideInput" as "roadsideInput",
training."rrCrossing" as "rrCrossing",
training."rrCrossingInput" as "rrCrossingInput",
training."signs" as "signs",
training."signsInput" as "signsInput",
training."generalDriving" as "generalDriving",
training."generalDrivingInput" as "generalDrivingInput",
training."eLogPractical" as "eLogPractical",
training."eLogPracticalInput" as "eLogPracticalInput",
training."satisfactoryRoadTesting" as "satisfactoryRoadTesting",
training."pullUpsInput_ad90" as "pullUpsInput_ad90",
training."encroachInput_ad90" as "encroachInput_ad90",
training."goal_ad90" as "goal_ad90",
training."finalPosition_ad90" as "finalPosition_ad90",
training."finalResultRoadSkills" as "finalResultRoadSkills",
(training."endDateRoadSkill" - training."created_at") as endDateRoadSkill,
(training."endDateBasicSkill" - training."created_at") as endDateBasicSkill,
(training."endDatePreTrip" - training."created_at") as endDatePreTrip,
  concat(emp_trainee.first_name,' ' ,emp_trainee.last_name)	as "trainee_name",
      emp_trainee.id as "trainee_id",
      concat(emp_trainer.first_name,' ' ,emp_trainer.last_name)	as "trainer_name",
      emp_trainer.id as "trainer_id"

FROM "Training" training
INNER JOIN "Employees" emp_trainee
		  ON training.trainee_id = emp_trainee."id"
		  INNER JOIN "Employees" emp_trainer
		  ON training.trainer_id = emp_trainer."id"
WHERE trainer_id = '${records.trainer_id}'
AND trainee_id = '${records.trainee_id}'
AND evaluation_form = 'digital-form'
AND CAST(training.created_at AS Date) = '${records.date}'
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
