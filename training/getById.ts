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
      trn."airCompresseorEngine" as "airCompresseorEngine",
      trn."alternatorBelt" as "alternatorBelt",
      trn."clutchCondition" as "clutchCondition",
      trn."commentsEngine" as "commentsEngine",
      trn."coolantLevelEngine" as "coolantLevelEngine",
      trn."fanShroud" as "fanShroud",
      trn."h20" as "h20",
      trn."hosesSteering" as "hosesSteering",
      trn."leaksHoses" as "leaksHoses",
      trn."mirror" as "mirror",
      trn."oilLevel" as "oilLevel",
      trn."powerSteelingLevel" as "powerSteelingLevel",
      trn."radiator" as "radiator",
      trn."steeringBox" as "steeringBox",
      trn."steeringLinkage" as "steeringLinkage",
      trn."turbo" as "turbo",
      trn."windowFluid" as "windowFluid",
      trn."wiring" as "wiring",
      trn."safetyBelt" as "safetyBelt",
      trn."coolantLevelCab" as "coolantLevelCab",
      trn."emergencyEquipment" as "emergencyEquipment",
      trn."safeStart" as "safeStart",
      trn."temperatureGauge" as "temperatureGauge",
      trn."oilPressure" as "oilPressure",
      trn."voltMeter" as "voltMeter",
      trn."airGaugeBuCo" as "airGaugeBuCo",
      trn."indicators" as "indicators",
      trn."horns" as "horns",
      trn."defroster" as "defroster",
      trn."windshield" as "windshield",
      trn."wipersWash" as "wipersWash",
      trn."parkBrake" as "parkBrake",
      trn."svcBrake" as "svcBrake",
      trn."leakTest" as "leakTest",
      trn."abcLights" as "abcLights",
      trn."lightFunction" as "lightFunction",
      trn."commentsCab" as "commentsCab",
      trn."lightFunctionVehicle" as "lightFunctionVehicle",
      trn."lensReflector" as "lensReflector",
      trn."door" as "door",
      trn."fuelTank" as "fuelTank",
      trn."leaks" as "leaks",
      trn."steps" as "steps",
      trn."frame" as "frame",
      trn."driveShaft" as "driveShaft",
      trn."tires" as "tires",
      trn."rims" as "rims",
      trn."lugNuts" as "lugNuts",
      trn."axelHubSeal" as "axelHubSeal",
      trn."bidSpacers" as "bidSpacers",
      trn."batteryBox" as "batteryBox",
      trn."exhaust" as "exhaust",
      trn."headerBvd" as "headerBvd",
      trn."landingGear" as "landingGear",
      trn."commentsVehicle" as "commentsVehicle",
      trn."airConditioners" as "airConditioners",
      trn."electricConnectors" as "electricConnectors",
      trn."mountingBolts" as "mountingBolts",
      trn."platformBase" as "platformBase",
      trn."lockingJaws" as "lockingJaws",
      trn."grease" as "grease",
      trn."skidPlate" as "skidPlate",
      trn."slidingPins" as "slidingPins",
      trn."kingPin" as "kingPin",
      trn."apron" as "apron",
      trn."gap" as "gap",
      trn."airLine" as "airLine",
      trn."location" as "location",
      trn."safetyDevices" as "safetyDevices",
      trn."print" as "print",
      trn."drawBar" as "drawBar",
      trn."commentsCoupling" as "commentsCoupling",
      trn."springs" as "springs",
      trn."airBags" as "airBags",
      trn."shocks" as "shocks",
      trn."vBolts" as "vBolts",
      trn."mounts" as "mounts",
      trn."bushings" as "bushings",
      trn."leafSprings" as "leafSprings",
      trn."slackAdjusters" as "slackAdjusters",
      trn."crackChammber" as "crackChammber",
      trn."pushRod" as "pushRod",
      trn."drums" as "drums",
      trn."linings" as "linings",
      trn."rotor" as "rotor",
      trn."discPads" as "discPads",
      trn."brakeHoses" as "brakeHoses",
      trn."cams" as "cams",
      trn."torqueArm" as "torqueArm",
      trn."wheelSeals" as "wheelSeals",
      trn."commentsSuspension" as "commentsSuspension",
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
