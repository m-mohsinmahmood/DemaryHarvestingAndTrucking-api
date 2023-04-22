import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { rawListeners } from "process";
import { config } from "../services/database/database.config";
import { engineCompartment, inCab, vehicleExternal,coupling,straightLineBacking, alleyDocking,alleyDocking90, offSetBacking, parkingBlind,parkingSight, coupUncoup, roadSkillsDigital} from "./model";

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
    const straightLineBacking: straightLineBacking = req.body;
    const alleyDocking: alleyDocking = req.body;
    const alleyDocking90: alleyDocking90 = req.body;

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
                "leans"                    = '${engineCompartment.leans}',
                "leaks"                    = '${engineCompartment.leaks}',
                "lights"                    = '${engineCompartment.lights}',
                "hazards"                   = '${engineCompartment.hazards}',
                "check_neutral"                    = '${engineCompartment.check_neutral}',
                "parking_brakes"                    = '${engineCompartment.parking_brakes}',
                "power_steering_level"                    = '${engineCompartment.power_steering_level}',
                "keys_removed"                    = '${engineCompartment.keys_removed}',
                "outside_windshield"                    = '${engineCompartment.outside_windshield}',
                "wiper_condition"                    = '${engineCompartment.wiper_condition}',
                 "engine_oil"                     = '${engineCompartment.engine_oil}',
                 "power_steering_evel"                     = '${engineCompartment.power_steering_evel}',
                 "wiring_loom"                     = '${engineCompartment.wiring_loom}',
                 "frame_condition"                     = '${engineCompartment.frame_condition}',
                 "hub_oil_level"                     = '${engineCompartment.hub_oil_level}',
                 "hub_seal_outer"                     = '${engineCompartment.hub_seal_outer}',
                 "hub_seal_inner"                     = '${engineCompartment.hub_seal_inner}',
                 "rim"                     = '${engineCompartment.rim}',
                 "lug_nuts"                     = '${engineCompartment.lug_nuts}',
                 "valve_stems"                     = '${engineCompartment.valve_stems}',
                 "side_walls"                     = '${engineCompartment.side_walls}',
                 "tread"                     = '${engineCompartment.tread}',
                 "brake_drum"                     = '${engineCompartment.brake_drum}',
                 "brake_pads"                     = '${engineCompartment.brake_pads}',
                 "slack_adjuster"                     = '${engineCompartment.slack_adjuster}',
                 "push_rod"                     = '${engineCompartment.push_rod}',
                 "brake_chamber"                     = '${engineCompartment.brake_chamber}',
                 "brake_hoses"                     = '${engineCompartment.brake_hoses}',
                 "air_compressor"                     = '${engineCompartment.air_compressor}',
                 "steering_shaft"                     = '${engineCompartment.steering_shaft}',
                 "universal_joints"                     = '${engineCompartment.universal_joints}',
                 "steering_blocks"                     = '${engineCompartment.steering_blocks}',
                 "steering_linkages"                     = '${engineCompartment.steering_linkages}',
                 "steering_hoses"                     = '${engineCompartment.steering_hoses}',
                 "steering_pump"                     = '${engineCompartment.steering_pump}',
                 "suspension_mounts"                     = '${engineCompartment.suspension_mounts}',
                 "bushings"                     = '${engineCompartment.bushings}',
                 "leaf_springs"                     = '${engineCompartment.leaf_springs}',
                 "u_bolts"                     = '${engineCompartment.u_bolts}',
                 "shock_absorbers"                     = '${engineCompartment.shock_absorbers}',
                 "clutch_condition"                     = '${engineCompartment.clutch_condition}',
                 "inter_cooler_ducts"                     = '${engineCompartment.inter_cooler_ducts}',
                 "radiator"                     = '${engineCompartment.radiator}',
                 "radiator_fan"                     = '${engineCompartment.radiator_fan}',
                 "radiator_shroud"                     = '${engineCompartment.radiator_shroud}',
                 "radiator_hoses"                     = '${engineCompartment.radiator_hoses}',
                 "ac_pump"                     = '${engineCompartment.ac_pump}',
                 "alternator"                     = '${engineCompartment.alternator}',
                 "water_pump"                     = '${engineCompartment.water_pump}',
                 "coolant_reservoir"                     = '${engineCompartment.coolant_reservoir}',
                 "coolant_level"                     = '${engineCompartment.coolant_level}',
                 "windshield_washer_level"                     = '${engineCompartment.windshield_washer_level}',
                 "turbo"                     = '${engineCompartment.turbo}',
                 "exhaust_sysytem"                     = '${engineCompartment.exhaust_sysytem}',
                 "step"                     = '${engineCompartment.step}',
                 "battery_box"                     = '${engineCompartment.battery_box}',
                 "mirrors"                     = '${engineCompartment.mirrors}',
                 "hand_rail"                     = '${engineCompartment.hand_rail}',
                 "door"                     = '${engineCompartment.door}',
                 "hinges"                     = '${engineCompartment.hinges}',
                 "commentsEngine"                     = $$${engineCompartment.commentsEngine}$$,
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
                "seat_belt"                    = '${inCab.seat_belt}',
                "loose_floor"                    = '${inCab.loose_floor}',
                "mirror_positioning"                    = '${inCab.mirror_positioning}',
                "gear_stick_condition"                    = '${inCab.gear_stick_condition}',
                "emergency_items"                    = '${inCab.emergency_items}',
                "safe_start"                    = '${inCab.safe_start}',
                "dash_lights"                    = '${inCab.dash_lights}',
                "warning_lights"                    = '${inCab.warning_lights}',
                "turn_signals"                    = '${inCab.turn_signals}',
                "way_4_flashers"                    = '${inCab.way_4_flashers}',
                 "high_beam"                     = '${inCab.high_beam}',
                 "abs_lights"                     = '${inCab.abs_lights}',
                 "volt_meter"                     = '${inCab.volt_meter}',
                 "fuel_level"                     = '${inCab.fuel_level}',
                 "oil_pressure"                     = '${inCab.oil_pressure}',
                 "air_pressure"                     = '${inCab.air_pressure}',
                 "coolant_temperature"                     = '${inCab.coolant_temperature}',
                 "diff_lock_engages"                     = '${inCab.diff_lock_engages}',
                 "heater_demister"                     = '${inCab.heater_demister}',
                 "horn"                     = '${inCab.horn}',
                 "wiper_washer_working"                     = '${inCab.wiper_washer_working}',
                 "test_service_brake"                     = '${inCab.test_service_brake}',
                 "test_trailer_park_brake"                     = '${inCab.test_trailer_park_brake}',
                 "test_truck_park_brake"                     = '${inCab.test_truck_park_brake}',
                 "leak_stage_1"                     = '${inCab.leak_stage_1}',
                 "leak_stage_2"                     = '${inCab.leak_stage_2}',
                 "leak_stage_3"                     = '${inCab.leak_stage_3}',
                 "front_external_lights"                     = '${inCab.front_external_lights}',
                 "trailer_lights"                     = '${inCab.trailer_lights}',
                 "rear_external_lights"                     = '${inCab.rear_external_lights}',
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
                "fuel_tank_sec"                    = '${vehicleExternal.fuel_tank_sec}',
                "fuel_tank_leaks"                    = '${vehicleExternal.fuel_tank_leaks}',
                "head_rack"                    = '${vehicleExternal.head_rack}',
                "cab_air_bags"                    = '${vehicleExternal.cab_air_bags}',
                "cat_walk"                    = '${vehicleExternal.cat_walk}',
                "cat_walk_steps"                    = '${vehicleExternal.cat_walk_steps}',
                "air_electrical_lines_truck"                    = '${vehicleExternal.air_electrical_lines_truck}',
                "chassis_frame"                    = '${vehicleExternal.chassis_frame}',
                "wheel_front_fender"                    = '${vehicleExternal.wheel_front_fender}',
                "tire_hub_oil_outer"                    = '${vehicleExternal.tire_hub_oil_outer}',
                 "tire_hub_oil_inner"                     = '${vehicleExternal.tire_hub_oil_inner}',
                 "tire_rim"                     = '${vehicleExternal.tire_rim}',
                 "tire_lug_nuts"                     = '${vehicleExternal.tire_lug_nuts}',
                 "tire_valve_stem"                     = '${vehicleExternal.tire_valve_stem}',
                 "tire_sidewalls"                     = '${vehicleExternal.tire_sidewalls}',
                 "tires_tread"                     = '${vehicleExternal.tires_tread}',
                 "duals_evenly_matched"                   = '${vehicleExternal.duals_evenly_matched}',
                 "duals_no_rim_gaps"                     = '${vehicleExternal.duals_no_rim_gaps}',
                 "duals_not_touching"                     = '${vehicleExternal.duals_not_touching}',
                 "duals_clear_rocks"                     = '${vehicleExternal.duals_clear_rocks}',
                 "duals_no_mis_match"                     = '${vehicleExternal.duals_no_mis_match}',
                 "drive_wheel_brake_drum"                     = '${vehicleExternal.drive_wheel_brake_drum}',
                 "drive_wheel_brake_pads"                     = '${vehicleExternal.drive_wheel_brake_pads}',
                 "drive_wheel_slack_adjuster"                     = '${vehicleExternal.drive_wheel_slack_adjuster}',
                 "drive_wheel_push_rod"                     = '${vehicleExternal.drive_wheel_push_rod}',
                 "drive_wheel_brake_chamber"                     = '${vehicleExternal.drive_wheel_brake_chamber}',
                 "drive_wheel_brake_hoses"                     = '${vehicleExternal.drive_wheel_brake_hoses}',
                 "dw_suspension_wheels"                     = '${vehicleExternal.dw_suspension_wheels}',
                 "dw_bushings"                     = '${vehicleExternal.dw_bushings}',
                 "dw_leaf_springs"                     = '${vehicleExternal.dw_leaf_springs}',
                 "dw_u_bolts"                     = '${vehicleExternal.dw_u_bolts}',
                 "dw_shock_absorbers"                     = '${vehicleExternal.dw_shock_absorbers}',
                 "dw_airbags"                     = '${vehicleExternal.dw_airbags}',
                 "top_plate_apron"                     = '${vehicleExternal.top_plate_apron}',
                 "sliding_plate"                     = '${vehicleExternal.sliding_plate}',
                 "wheel_5"                     = '${vehicleExternal.wheel_5}',
                 "mounting_block"                     = '${vehicleExternal.mounting_block}',
                 "sliding_frame"                     = '${vehicleExternal.sliding_frame}',
                 "air_ram_line"                     = '${vehicleExternal.air_ram_line}',
                 "release_liver"                     = '${vehicleExternal.release_liver}',
                 "locking_jaws"                     = '${vehicleExternal.locking_jaws}',
                 "locking_pins"                     = '${vehicleExternal.locking_pins}',
                 "king_pin"                     = '${vehicleExternal.king_pin}',
                 "wheel_positioning_5"                     = '${vehicleExternal.wheel_positioning_5}',
                 "drive_shaft"                     = '${vehicleExternal.drive_shaft}',
                 "torison_bars"                     = '${vehicleExternal.torison_bars}',
                 "mud_flaps"                     = '${vehicleExternal.mud_flaps}',
                 "rear_lights"                     = '${vehicleExternal.rear_lights}',
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
               "is_digital_form_started"                    = 'FALSE',
                "air_electrical_lines"                    = '${coupling.air_electrical_lines}',
                "glad_hands"                    = '${coupling.glad_hands}',
                "clearence_lights"                    = '${coupling.clearence_lights}',
                "reflector_tape"                    = '${coupling.reflector_tape}',
                "chain_strap_attachment_bar"                    = '${coupling.chain_strap_attachment_bar}',
                "landing_gear"                    = '${coupling.landing_gear}',
                "cargo_box"                    = '${coupling.cargo_box}',
                "abs_lights"                    = '${coupling.abs_lights}',
                "mud_flaps"                    = '${coupling.mud_flaps}',
                 "docking_impact_frame"                     = '${coupling.docking_impact_frame}',
                 "license_plate"                     = '${coupling.license_plate}',
                 "commentsCoupling"                     = $$${coupling.commentsCoupling}$$,
                 "percentageCoupling"                     = '${coupling.percentageCoupling}',
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
        else if(entity === 'basic-skills' && alleyDocking.category === 'alley-docking-90'){
                query = `
                UPDATE 
                        "Training"
                SET 
                       "is_alley_backing90_started"                    = 'TRUE', 
                       "pullUpsInput_ad90"                    = '${alleyDocking90.pullUpsInput_ad90}',
                       "encroachInput_ad90"                    = '${alleyDocking90.encroachInput_ad90}',
                       "goal_ad90"                    = '${alleyDocking90.goal_ad90}',
                       "finalPosition_ad90"                    = '${alleyDocking90.finalPosition_ad90}',
                        "comments_ad90"                     = $$${alleyDocking90.comments_ad90}$$,
                        "satisfactoryAlleyDocking90"                     = '${alleyDocking90.satisfactoryAlleyDocking90}',
                        "unSatisfactoryAlleyDocking90"                     = '${alleyDocking90.unSatisfactoryAlleyDocking90}'
       
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
                    "sumRoadSkills"                     = '${roadSkillsDigital.sumRoadSkills}',
                    "finalResultRoadSkills"                     = '${roadSkillsDigital.finalResultRoadSkills}',
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
            