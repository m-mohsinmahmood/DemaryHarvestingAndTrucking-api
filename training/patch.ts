import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { rawListeners } from "process";
import { config } from "../services/database/database.config";
import { engineCompartment, inCab, vehicleExternal,coupling,suspensionBrakes,straightLineBacking, alleyDocking, offSetBacking, parkingBlind,parkingSight, coupUncoup, roadSkillsDigital} from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query = ``;
  try {
    const engineCompartment: engineCompartment = req.body;
    const inCab: inCab = req.body;
    const vehicleExternal: vehicleExternal = req.body;
    const coupling: coupling = req.body;
    const suspensionBrakes: suspensionBrakes = req.body;
    const straightLineBacking: straightLineBacking = req.body;
    const alleyDocking: alleyDocking = req.body;
    const offSetBacking: offSetBacking = req.body;
    const parkingBlind: parkingBlind = req.body;
    const parkingSight: parkingSight = req.body;
    const coupUncoup: coupUncoup = req.body;
    const roadSkillsDigital: roadSkillsDigital = req.body;
    const entity = req.query.entity;

    console.log('Request::',req.body);
    console.log('Entity:',entity);

    let query=``
        if(entity === 'pre-trip' && engineCompartment.category === 'engine-compartment'){
      query = `
         UPDATE 
                 "Training"
         SET 
                "is_engine_compartment_started"                    = 'TRUE', 
                "airCompresseorEngine"                    = '${engineCompartment.airCompresseorEngine}',
                "alternatorBelt"                    = '${engineCompartment.alternatorBelt}',
                "clutchCondition"                    = '${engineCompartment.clutchCondition}',
                "commentsEngine"                    = $$${engineCompartment.commentsEngine}$$,
                "coolantLevelEngine"                    = '${engineCompartment.coolantLevelEngine}',
                "fanShroud"                    = '${engineCompartment.fanShroud}',
                "h20"                    = '${engineCompartment.h20}',
                "hosesSteering"                    = '${engineCompartment.hosesSteering}',
                "leaksHoses"                    = '${engineCompartment.leaksHoses}',
                "mirror"                    = '${engineCompartment.mirror}',
                 "oilLevel"                     = '${engineCompartment.oilLevel}',
                 "powerSteelingLevel"                     = '${engineCompartment.powerSteelingLevel}',
                 "radiator"                     = '${engineCompartment.radiator}',
                 "steeringBox"                     = '${engineCompartment.steeringBox}',
                 "steeringLinkage"                     = '${engineCompartment.steeringLinkage}',
                 "turbo"                     = '${engineCompartment.turbo}',
                 "windowFluid"                     = '${engineCompartment.windowFluid}',
                 "wiring"                     = '${engineCompartment.wiring}',
                 "percentageEngineCompartment"                     = '${engineCompartment.percentageEngineCompartment}'

                 WHERE trainer_id='${roadSkillsDigital.trainer_id}'  AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'pre-trip'
         ;`
        }
        else if(entity === 'pre-trip' && inCab.category === 'in-cab'){
            query = `
         UPDATE 
                 "Training"
         SET 
                "is_in_cab_started"                    = 'TRUE', 
                "safetyBelt"                    = '${inCab.safetyBelt}',
                "coolantLevelCab"                    = '${inCab.coolantLevelCab}',
                "emergencyEquipment"                    = '${inCab.emergencyEquipment}',
                "safeStart"                    = '${inCab.safeStart}',
                "temperatureGauge"                    = '${inCab.temperatureGauge}',
                "oilPressure"                    = '${inCab.oilPressure}',
                "voltMeter"                    = '${inCab.voltMeter}',
                "airGaugeBuCo"                    = '${inCab.airGaugeBuCo}',
                "indicators"                    = '${inCab.indicators}',
                "horns"                    = '${inCab.horns}',
                 "defroster"                     = '${inCab.defroster}',
                 "windshield"                     = '${inCab.windshield}',
                 "wipersWash"                     = '${inCab.wipersWash}',
                 "parkBrake"                     = '${inCab.parkBrake}',
                 "svcBrake"                     = '${inCab.svcBrake}',
                 "leakTest"                     = '${inCab.leakTest}',
                 "abcLights"                     = '${inCab.abcLights}',
                 "lightFunction"                     = '${inCab.lightFunction}',
                 "commentsCab"                     = $$${inCab.commentsCab}$$,
                 "percentageInCab"                     = '${inCab.percentageInCab}'

                 WHERE trainer_id='${roadSkillsDigital.trainer_id}'  AND "evaluation_type" = 'pre-trip'
         ;`
        }
        else if(entity === 'pre-trip' && vehicleExternal.category === 'vehicle-external'){
            query = `
         UPDATE 
                 "Training"
         SET 
                "is_vehicle_external_started"                    = 'TRUE', 
                "lightFunctionVehicle"                    = '${vehicleExternal.lightFunctionVehicle}',
                "lensReflector"                    = '${vehicleExternal.lensReflector}',
                "door"                    = '${vehicleExternal.door}',
                "fuelTank"                    = '${vehicleExternal.fuelTank}',
                "leaks"                    = '${vehicleExternal.leaks}',
                "steps"                    = '${vehicleExternal.steps}',
                "frame"                    = '${vehicleExternal.frame}',
                "driveShaft"                    = '${vehicleExternal.driveShaft}',
                "tires"                    = '${vehicleExternal.tires}',
                "rims"                    = '${vehicleExternal.rims}',
                 "lugNuts"                     = '${vehicleExternal.lugNuts}',
                 "axelHubSeal"                     = '${vehicleExternal.axelHubSeal}',
                 "bidSpacers"                     = '${vehicleExternal.bidSpacers}',
                 "batteryBox"                     = '${vehicleExternal.batteryBox}',
                 "exhaust"                     = '${vehicleExternal.exhaust}',
                 "headerBvd"                     = '${vehicleExternal.headerBvd}',
                 "landingGear"                     = '${vehicleExternal.landingGear}',
                 "commentsVehicle"                     = $$${vehicleExternal.commentsVehicle}$$,
                 "percentageVehicleExternal"                     = '${vehicleExternal.percentageVehicleExternal}'

                 WHERE trainer_id='${roadSkillsDigital.trainer_id}'  AND "evaluation_type" = 'pre-trip'
         ;`
        }
        else if(entity === 'pre-trip' && coupling.category === 'coupling'){
            query = `
         UPDATE 
                 "Training"
         SET 
                "is_coupling_started"                    = 'TRUE', 
                "airConditioners"                    = '${coupling.airConditioners}',
                "electricConnectors"                    = '${coupling.electricConnectors}',
                "mountingBolts"                    = '${coupling.mountingBolts}',
                "platformBase"                    = '${coupling.platformBase}',
                "lockingJaws"                    = '${coupling.lockingJaws}',
                "grease"                    = '${coupling.grease}',
                "releaseArm"                    = '${coupling.releaseArm}',
                "skidPlate"                    = '${coupling.skidPlate}',
                "slidingPins"                    = '${coupling.slidingPins}',
                "kingPin"                    = '${coupling.kingPin}',
                 "apron"                     = '${coupling.apron}',
                 "gap"                     = '${coupling.gap}',
                 "airLine"                     = '${coupling.airLine}',
                 "location"                     = '${coupling.location}',
                 "safetyDevices"                     = '${coupling.safetyDevices}',
                 "print"                     = '${coupling.print}',
                 "drawBar"                     = '${coupling.drawBar}',
                 "commentsCoupling"                     = $$${coupling.commentsCoupling}$$,
                 "percentageCoupling"                     = '${coupling.percentageCoupling}'

                 WHERE trainer_id='${roadSkillsDigital.trainer_id}'  AND "evaluation_type" = 'pre-trip'
         ;`
        }
        else if(entity === 'pre-trip' && suspensionBrakes.category === 'suspension-brakes'){
            query = `
         UPDATE 
                 "Training"
         SET 
                "is_digital_form_started"                    = 'FALSE', 
                "springs"                    = '${suspensionBrakes.springs}',
                "airBags"                    = '${suspensionBrakes.airBags}',
                "shocks"                    = '${suspensionBrakes.shocks}',
                "vBolts"                    = '${suspensionBrakes.vBolts}',
                "mounts"                    = '${suspensionBrakes.mounts}',
                "bushings"                    = '${suspensionBrakes.bushings}',
                "leafSprings"                    = '${suspensionBrakes.leafSprings}',
                "slackAdjusters"                    = '${suspensionBrakes.slackAdjusters}',
                "crackChammber"                    = '${suspensionBrakes.crackChammber}',
                "pushRod"                    = '${suspensionBrakes.pushRod}',
                 "linings"                     = '${suspensionBrakes.linings}',
                 "rotor"                     = '${suspensionBrakes.rotor}',
                 "discPads"                     = '${suspensionBrakes.discPads}',
                 "brakeHoses"                     = '${suspensionBrakes.brakeHoses}',
                 "cams"                     = '${suspensionBrakes.cams}',
                 "torqueArm"                     = '${suspensionBrakes.torqueArm}',
                 "wheelSeals"                     = '${suspensionBrakes.wheelSeals}',
                 "commentsSuspension"                     = $$${suspensionBrakes.commentsSuspension}$$,
                 "percentageSuspension"                     = '${suspensionBrakes.percentageSuspension}',
                 "endDatePreTrip"                     = CURRENT_TIMESTAMP

                 WHERE trainer_id='${roadSkillsDigital.trainer_id}'  AND "evaluation_type" = 'pre-trip'
         ;`
        }
        else if(entity === 'basic-skills' && straightLineBacking.category === 'straight-line-backing'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_straight_line_backing_started"                    = 'TRUE', 
                   "pullUpsInput_slb"                    = '${straightLineBacking.pullUpsInput_slb}',
                   "encroachInput_slb"                    = '${straightLineBacking.encroachInput_slb}',
                   "goal_slb"                    = '${straightLineBacking.goal_slb}',
                   "finalPosition_slb"                    = '${straightLineBacking.finalPosition_slb}',
                   "straightLineBacking_slb"                    = '${straightLineBacking.straightLineBacking_slb}',
                   "straightLineBakingInput_slb"                    = '${straightLineBacking.straightLineBakingInput_slb}',
                   "alleyDocking_slb"                    = '${straightLineBacking.alleyDocking_slb}',
                   "alleyDockingInput_slb"                    = '${straightLineBacking.alleyDockingInput_slb}',
                   "offSetBacking_slb"                    = '${straightLineBacking.offSetBacking_slb}',
                   "offSetBackingInput_slb"                    = '${straightLineBacking.offSetBackingInput_slb}',
                    "parallelParkingBlind_slb"                     = '${straightLineBacking.parallelParkingBlind_slb}',
                    "parallelParkingBlindInput_slb"                     = '${straightLineBacking.parallelParkingBlindInput_slb}',
                    "coupUncoupInput_slb"                     = '${straightLineBacking.coupUncoupInput_slb}',
                    "comments_slb"                     = $$${straightLineBacking.comments_slb}$$,
                    "satisfactoryStraightLineBacking"                     = '${straightLineBacking.satisfactoryStraightLineBacking}',
                    "unSatisfactoryStraightLineBacking"                     = '${straightLineBacking.unSatisfactoryStraightLineBacking}'
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}' AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'basic-skills'
            ;`
        }
        else if(entity === 'basic-skills' && alleyDocking.category === 'alley-docking'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_alley_backing_started"                    = 'TRUE', 
                   "pullUpsInput_ad"                    = '${alleyDocking.pullUpsInput_ad}',
                   "encroachInput_ad"                    = '${alleyDocking.encroachInput_ad}',
                   "goal_ad"                    = '${alleyDocking.goal_ad}',
                   "finalPosition_ad"                    = '${alleyDocking.finalPosition_ad}',
                   "straightLineBacking_ad"                    = '${alleyDocking.straightLineBacking_ad}',
                   "straightLineBakingInput_ad"                    = '${alleyDocking.straightLineBakingInput_ad}',
                   "alleyDocking_ad"                    = '${alleyDocking.alleyDocking_ad}',
                   "alleyDockingInput_ad"                    = '${alleyDocking.alleyDockingInput_ad}',
                   "offSetBacking_ad"                    = '${alleyDocking.offSetBacking_ad}',
                   "offSetBackingInput_ad"                    = '${alleyDocking.offSetBackingInput_ad}',
                    "parallelParkingBlind_ad"                     = '${alleyDocking.parallelParkingBlind_ad}',
                    "parallelParkingBlindInput_ad"                     = '${alleyDocking.parallelParkingBlindInput_ad}',
                    "coupUncoup_ad"                     = '${alleyDocking.coupUncoup_ad}',
                    "coupUncoupInput_ad"                     = '${alleyDocking.coupUncoupInput_ad}',
                    "comments_ad"                     = $$${alleyDocking.comments_ad}$$,
                    "satisfactoryAlleyDocking"                     = '${alleyDocking.satisfactoryAlleyDocking}',
                    "unSatisfactoryAlleyDocking"                     = '${alleyDocking.unSatisfactoryAlleyDocking}'
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}'  AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'basic-skills'
            ;`
        }
        else if(entity === 'basic-skills' && offSetBacking.category === 'off-set-backing'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_off_set_backing_started"                    = 'TRUE', 
                   "pullUps_osb"                    = '${offSetBacking.pullUps_osb}',
                   "encroach_osb"                    = '${offSetBacking.encroach_osb}',
                   "goal_osb"                    = '${offSetBacking.goal_osb}',
                   "finalPosition_osb"                    = '${offSetBacking.finalPosition_osb}',
                   "straightLineBaking_osb"                    = '${offSetBacking.straightLineBaking_osb}',
                   "straightLineBakingInput_osb"                    = '${offSetBacking.straightLineBakingInput_osb}',
                   "alleyDocking_osb"                    = '${offSetBacking.alleyDocking_osb}',
                   "alleyDockingInput_osb"                    = '${offSetBacking.alleyDockingInput_osb}',
                   "offSetBacking_osb"                    = '${offSetBacking.offSetBacking_osb}',
                   "offSetBackingInput_osb"                    = '${offSetBacking.offSetBackingInput_osb}',
                   "parallelParkingBlind_osb"                     = '${offSetBacking.parallelParkingBlind_osb}',
                    "parallelParkingBlindInput_osb"                     = '${offSetBacking.parallelParkingBlindInput_osb}',
                    "coupUncoup_osb"                     = '${offSetBacking.coupUncoup_osb}',
                    "coupUncoupInput_osb"                     = '${offSetBacking.coupUncoupInput_osb}',
                    "comments_osb"                     = $$${offSetBacking.comments_osb}$$,
                    "satisfactoryOffSetBacking"                     = '${offSetBacking.satisfactoryOffSetBacking}',
                    "unSatisfactoryOffSetBacking"                     = '${offSetBacking.unSatisfactoryOffSetBacking}'
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}' AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'basic-skills'
            ;`
        }
        else if(entity === 'basic-skills' && parkingBlind.category === 'parking-blind'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_parking_blind_started"                    = 'TRUE', 
                   "pullUps_pb"                    = '${parkingBlind.pullUps_pb}',
                   "encroach_pb"                    = '${parkingBlind.encroach_pb}',
                   "goal_pb"                    = '${parkingBlind.goal_pb}',
                   "finalPosition_pb"                    = '${parkingBlind.finalPosition_pb}',
                   "straightLineBaking_pb"                    = '${parkingBlind.straightLineBaking_pb}',
                   "straightLineBakingInput_pb"                    = '${parkingBlind.straightLineBakingInput_pb}',
                   "alleyDocking_pb"                    = '${parkingBlind.alleyDocking_pb}',
                   "alleyDockingInput_pb"                    = '${parkingBlind.alleyDockingInput_pb}',
                   "offSetBacking_pb"                    = '${parkingBlind.offSetBacking_pb}',
                   "offSetBackingInput_pb"                    = '${parkingBlind.offSetBackingInput_pb}',
                    "parallelParkingBlind_pb"                     = '${parkingBlind.parallelParkingBlind_pb}',
                    "parallelParkingBlindInput_pb"                     = '${parkingBlind.parallelParkingBlindInput_pb}',
                    "coupUncoup_pb"                     = '${parkingBlind.coupUncoup_pb}',
                    "coupUncoupInput_pb"                     = '${parkingBlind.coupUncoupInput_pb}',
                    "comments_pb"                     = $$${parkingBlind.comments_pb}$$,
                    "satisfactoryParkingBlind"                     = '${parkingBlind.satisfactoryParkingBlind}',
                    "unSatisfactoryParkingBlind"                     = '${parkingBlind.unSatisfactoryParkingBlind}'
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}' AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'basic-skills'
            ;`
        }
        else if(entity === 'basic-skills' && parkingSight.category === 'parking-sight'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_parking_sight_started"                    = 'TRUE', 
                   "pullUps_ps"                    = '${parkingSight.pullUps_ps}',
                   "encroach_ps"                    = '${parkingSight.encroach_ps}',
                   "goal_ps"                    = '${parkingSight.goal_ps}',
                   "finalPosition_ps"                    = '${parkingSight.finalPosition_ps}',
                   "straightLineBaking_ps"                    = '${parkingSight.straightLineBaking_ps}',
                   "straightLineBakingInput_ps"                    = '${parkingSight.straightLineBakingInput_ps}',
                   "alleyDocking_ps"                    = '${parkingSight.alleyDocking_ps}',
                   "alleyDockingInput_ps"                    = '${parkingSight.alleyDockingInput_ps}',
                   "offSetBacking_ps"                    = '${parkingSight.offSetBacking_ps}',
                   "offSetBackingInput_ps"                    = '${parkingSight.offSetBackingInput_ps}',
                    "parallelParkingBlind_ps"                     = '${parkingSight.parallelParkingBlind_ps}',
                    "parallelParkingBlindInput_ps"                     = '${parkingSight.parallelParkingBlindInput_ps}',
                    "coupUncoup_ps"                     = '${parkingSight.coupUncoup_ps}',
                    "coupUncoupInput_ps"                     = '${parkingSight.coupUncoupInput_ps}',
                    "comments_ps"                     = $$${parkingSight.comments_ps}$$,
                    "satisfactoryParkingSight"                     = '${parkingSight.satisfactoryParkingSight}',
                    "unSatisfactoryParkingSight"                     = '${parkingSight.unSatisfactoryParkingSight}'
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}' AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'basic-skills'
            ;`
        }
        else if(entity === 'basic-skills' && coupUncoup.category === 'coup-uncoup'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_digital_form_started"                    = 'FALSE', 
                   "pullUps_cou"                    = '${coupUncoup.pullUps_cou}',
                   "encroach_cou"                    = '${coupUncoup.encroach_cou}',
                   "goal_cou"                    = '${coupUncoup.goal_cou}',
                   "finalPosition_cou"                    = '${coupUncoup.finalPosition_cou}',
                   "straightLineBacking_cou"                    = '${coupUncoup.straightLineBacking_cou}',
                   "straightLineBackingInput_cou"                    = '${coupUncoup.straightLineBackingInput_cou}',
                   "alleyDocking_cou"                    = '${coupUncoup.alleyDocking_cou}',
                   "alleyDockingInput_cou"                    = '${coupUncoup.alleyDockingInput_cou}',
                   "offSetBacking_cou"                    = '${coupUncoup.offSetBacking_cou}',
                   "offSetBackingInput_cou"                    = '${coupUncoup.offSetBackingInput_cou}',
                    "parallelParkingBlind_cou"                     = '${coupUncoup.parallelParkingBlind_cou}',
                    "parallelParkingBlindInput_cou"                     = '${coupUncoup.parallelParkingBlindInput_cou}',
                    "coupUncoup_cou"                     = '${coupUncoup.coupUncoup_cou}',
                    "coupUncoupInput_cou"                     = '${coupUncoup.coupUncoupInput_cou}',
                    "comments_cou"                     = $$${coupUncoup.comments_cou}$$,
                    "satisfactoryCoupUncoup"                     = '${coupUncoup.satisfactoryCoupUncoup}',
                    "unSatisfactoryCoupUncoup"                     = '${coupUncoup.unSatisfactoryCoupUncoup}',
                    "endDateBasicSkill"                     = CURRENT_TIMESTAMP
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}' AND  "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'basic-skills'
            ;`
        }
        else if(entity === 'road-skills' && roadSkillsDigital.category === 'road-testing'){
            query = `
            UPDATE 
                    "Training"
            SET 
                   "is_digital_form_started"                    = 'FALSE', 
                   "leftTurns"                    = '${roadSkillsDigital.leftTurns}',
                   "leftTurnsInput"                    = '${roadSkillsDigital.leftTurnsInput}',
                   "rightTurns"                    = '${roadSkillsDigital.rightTurns}',
                   "rightTurnsInput"                    = '${roadSkillsDigital.rightTurnsInput}',
                   "intersectionStop"                    = '${roadSkillsDigital.intersectionStop}',
                   "intersectionStopInput"                    = '${roadSkillsDigital.intersectionStopInput}',
                   "intersectionThru"                    = '${roadSkillsDigital.intersectionThru}',
                   "intersectionThruInput"                    = '${roadSkillsDigital.intersectionThruInput}',
                   "interstate"                    = '${roadSkillsDigital.interstate}',
                   "interstateInput"                    = '${roadSkillsDigital.interstateInput}',
                    "urbanBusiness"                     = '${roadSkillsDigital.urbanBusiness}',
                    "urbanBusinessInput"                     = '${roadSkillsDigital.urbanBusinessInput}',
                    "lanceChanges"                     = '${roadSkillsDigital.lanceChanges}',
                    "lanceChangesInput"                     = '${roadSkillsDigital.lanceChangesInput}',
                    "curve"                     = '${roadSkillsDigital.curve}',
                    "curveInput"                     = '${roadSkillsDigital.curveInput}',
                    "roadside"                     = '${roadSkillsDigital.roadside}',
                    "roadsideInput"                     = '${roadSkillsDigital.roadsideInput}',
                    "rrCrossing"                     = '${roadSkillsDigital.rrCrossing}',
                    "rrCrossingInput"                     = '${roadSkillsDigital.rrCrossingInput}',
                    "signs"                     = '${roadSkillsDigital.signs}',
                    "signsInput"                     = '${roadSkillsDigital.signsInput}',
                    "generalDriving"                     = '${roadSkillsDigital.generalDriving}',
                    "generalDrivingInput"                     = '${roadSkillsDigital.generalDrivingInput}',
                    "eLogPractical"                     = '${roadSkillsDigital.eLogPractical}',
                    "eLogPracticalInput"                     = '${roadSkillsDigital.eLogPracticalInput}',
                    "satisfactoryRoadTesting"                     = '${roadSkillsDigital.satisfactoryRoadTesting}',
                    "unSatisfactoryRoadTesting"                     = '${roadSkillsDigital.unSatisfactoryRoadTesting}',
                    "endDateRoadSkill"                     = CURRENT_TIMESTAMP
   
                    WHERE trainer_id='${roadSkillsDigital.trainer_id}' AND "is_digital_form_started" = 'TRUE' AND "evaluation_type" = 'road-skills'
            ;`
        }
           console.log('Query:',query)
                db.connect();
                let result = await db.query(query);
                db.end();
            
                context.res = {
                  status: 200,
                  body: {
                    message: "Submitted",
                    status: 200,
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
            