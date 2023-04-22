export interface trainee {
    trainee_id: string;
    trainer_id?: string;
    city?: string;
    state?: string;
    training_type:string;
    topic:string;
    detail: string;
}
export interface trainer{
    trainer_id?: string;
    supervisor_id: string;
    city: string;
    state: string;
    training_type: string;
    topic: string;
    notes: string
}
export interface preTripCheck{
    trainer_id?: string;
    trainee_id: string;
    supervisor_id: string;
    city: string;
    state: string;
    evaluation_form: string;
    is_completed_cdl_classroom: string;
    is_completed_group_practical: string;
    category?: string;
}
export interface engineCompartment {

      leans: string,
      leaks: string,
      lights: string,
      hazards: string,
      check_neutral: string,
      parking_brakes: string,
      power_steering_level: string,
      keys_removed: string,
      outside_windshield: string,
      wiper_condition: string,
      engine_oil: string,
      power_steering_evel: string,
      wiring_loom: string,
      frame_condition: string,
      hub_oil_level: string,
      hub_seal_outer: string,
      hub_seal_inner: string,
      rim: string,
      lug_nuts: string,
      valve_stems: string,
      side_walls: string,
      tread: string,
      brake_drum: string,
      brake_pads: string,
      slack_adjuster: string,
      push_rod: string,
      brake_chamber: string,
      brake_hoses: string,
      air_compressor: string,
      steering_shaft: string,
      universal_joints: string,
      steering_blocks: string,
      steering_linkages: string,
      steering_hoses: string,
      steering_pump: string,
      suspension_mounts: string,
      bushings: string,
      leaf_springs: string,
      u_bolts: string,
      shock_absorbers: string,
      clutch_condition: string,
      inter_cooler_ducts: string,
      radiator: string,
      radiator_fan: string,
      radiator_shroud: string,
      radiator_hoses: string,
      ac_pump: string,
      alternator: string,
      water_pump: string,
      coolant_reservoir: string,
      coolant_level: string,
      windshield_washer_level: string,
      turbo: string,
      exhaust_sysytem: string,
      step: string,
      battery_box: string,
      mirrors: string,
      hand_rail: string,
      door: string,
      hinges: string,
      commentsEngine: string,
      category: string,
      percentageEngineCompartment: string
}
export interface inCab {
    seat_belt: string,
      loose_floor: string,
      mirror_positioning: string,
      gear_stick_condition: string,
      emergency_items: string,
      safe_start: string,
      dash_lights: string,
      warning_lights: string,
      turn_signals: string,
      way_4_flashers: string,
      high_beam: string,
      abs_lights: string,
      volt_meter: string,
      fuel_level: string,
      oil_pressure: string,
      air_pressure: string,
      coolant_temperature: string,
      diff_lock_engages: string,
      heater_demister: string,
      horn: string,
      wiper_washer_working: string,
      test_service_brake: string,
      test_trailer_park_brake: string,
      test_truck_park_brake: string,
      leak_stage_1: string,
      leak_stage_2: string,
      leak_stage_3: string,
      front_external_lights: string,
      trailer_lights: string,
      rear_external_lights: string,
      commentsCab: string,
      category:string,
      percentageInCab:string,

}
export interface vehicleExternal {

    fuel_tank_sec: string,
      fuel_tank_leaks: string,
      head_rack: string,
      cab_air_bags: string,
      cat_walk: string,
      cat_walk_steps: string,
      air_electrical_lines_truck: string,
      chassis_frame: string,
      wheel_front_fender: string,
      tire_hub_oil_outer: string,
      tire_hub_oil_inner: string,
      tire_rim: string,
      tire_lug_nuts: string,
      tire_valve_stem: string,
      tire_sidewalls: string,
      tires_tread: string,
      duals_evenly_matched: string,
      duals_no_rim_gaps: string,
      duals_not_touching: string,
      duals_clear_rocks: string,
      duals_no_mis_match: string,
      drive_wheel_brake_drum: string,
      drive_wheel_brake_pads: string,
      drive_wheel_slack_adjuster: string,
      drive_wheel_push_rod: string,
      drive_wheel_brake_chamber: string,
      drive_wheel_brake_hoses: string,
      dw_suspension_wheels: string,
      dw_bushings: string,
      dw_leaf_springs: string,
      dw_u_bolts: string,
      dw_shock_absorbers: string,
      dw_airbags: string,
      top_plate_apron: string,
      sliding_plate: string,
      wheel_5: string,
      mounting_block: string,
      sliding_frame: string,
      air_ram_line: string,
      release_liver: string,
      locking_jaws: string,
      locking_pins: string,
      king_pin: string,
      wheel_positioning_5: string,
      drive_shaft: string,
      torison_bars: string,
      mud_flaps: string,
      rear_lights: string,
      commentsVehicle: string,
      category:string,
      percentageVehicleExternal:string,
}
export interface coupling {

    air_electrical_lines: string,
  glad_hands: string,
  clearence_lights: string,
  reflector_tape: string,
  chain_strap_attachment_bar: string,
  landing_gear: string,
  cargo_box: string,
  abs_lights: string,
  mud_flaps: string,
  docking_impact_frame: string,
  license_plate: string,
  commentsCoupling: string,
  category:string,
  percentageCoupling:string,
}

export interface basicSkills{
    trainer_id?: string;
    trainee_id: string;
    supervisor_id: string;
    city: string;
    state: string;
    evaluation_form: string;
    is_completed_cdl_classroom: string;
    is_completed_group_practical: string
    category?: string;
    clp?: string;
    odometerEndingMiles?: string;
    odometerStartingMiles?: string;
    truckId?: string;
}
export interface straightLineBacking {
    category: string;
    pullUpsInput_slb: string,
      encroachInput_slb: string,
      goal_slb: string,
      finalPosition_slb: string,
      straightLineBacking_slb: string,
      straightLineBakingInput_slb: string, //<-
      alleyDocking_slb: string,
      alleyDockingInput_slb: string,
      offSetBacking_slb: string,
      offSetBackingInput_slb: string,
      parallelParkingBlind_slb: string,
      parallelParkingBlindInput_slb: string,
      coupUncoup_slb: string,
      coupUncoupInput_slb: string,
      comments_slb: string,
      satisfactoryStraightLineBacking:string,
      unSatisfactoryStraightLineBacking:string,
      trainer_id: string
}
export interface alleyDocking {
     category: string;
     pullUpsInput_ad: string,
      encroachInput_ad: string,
      goal_ad: string,
      finalPosition_ad: string,
      straightLineBacking_ad: string,
      straightLineBakingInput_ad: string, //<-
      alleyDocking_ad: string,
      alleyDockingInput_ad: string,
      offSetBacking_ad: string,
      offSetBackingInput_ad: string,
      parallelParkingBlind_ad: string,
      parallelParkingBlindInput_ad: string,
      coupUncoup_ad: string,
      coupUncoupInput_ad: string,
      comments_ad: string,
      satisfactoryAlleyDocking:string,
      unSatisfactoryAlleyDocking:string,
      trainer_id: string,
}
export interface alleyDocking90 {
    category: string;
    pullUpsInput_ad90: string,
     encroachInput_ad90: string,
     goal_ad90: string,
     finalPosition_ad90: string,
     straightLineBacking_ad: string,
     straightLineBakingInput_ad: string, //<-
     alleyDocking_ad: string,
     alleyDockingInput_ad: string,
     offSetBacking_ad: string,
     offSetBackingInput_ad: string,
     parallelParkingBlind_ad: string,
     parallelParkingBlindInput_ad: string,
     coupUncoup_ad: string,
     coupUncoupInput_ad: string,
     comments_ad90: string,
     satisfactoryAlleyDocking90:string,
     unSatisfactoryAlleyDocking90:string,
     trainer_id: string,
}
export interface offSetBacking {
    category: string;
    pullUps_osb: string,
    encroach_osb: string,
    goal_osb: string,
    finalPosition_osb: string,
    straightLineBaking_osb: string,
    straightLineBakingInput_osb: string,
    alleyDocking_osb: string,
    alleyDockingInput_osb: string,
    offSetBacking_osb: string,
    offSetBackingInput_osb: string,
    parallelParkingBlind_osb: string,
    parallelParkingBlindInput_osb: string,
    coupUncoup_osb: string,
    coupUncoupInput_osb: string,
    comments_osb: string,
    satisfactoryOffSetBacking:string,
    unSatisfactoryOffSetBacking:string,
    trainer_id: string
}
export interface parkingBlind{
        category: string;
        pullUps_pb: string,
        encroach_pb: string,
        goal_pb: string,
        finalPosition_pb: string,
        straightLineBaking_pb: string,
        straightLineBakingInput_pb: string,
        alleyDocking_pb: string,
        alleyDockingInput_pb: string,
        offSetBacking_pb: string,
        offSetBackingInput_pb: string,
        parallelParkingBlind_pb: string,
        parallelParkingBlindInput_pb: string,
        coupUncoup_pb: string,
        coupUncoupInput_pb: string,
        comments_pb:string,
        satisfactoryParkingBlind:string,
        unSatisfactoryParkingBlind:string,
        trainer_id: string
}
export interface parkingSight{
    category: string;
    pullUps_ps: string,
        encroach_ps: string,
        goal_ps: string,
        finalPosition_ps: string,
        straightLineBaking_ps: string,
        straightLineBakingInput_ps: string,
        alleyDocking_ps: string,
        alleyDockingInput_ps: string,
        offSetBacking_ps: string,
        offSetBackingInput_ps: string,
        parallelParkingBlind_ps: string,
        parallelParkingBlindInput_ps: string,
        coupUncoup_ps: string,
        coupUncoupInput_ps: string,
        comments_ps:string,
        satisfactoryParkingSight:string,
        unSatisfactoryParkingSight:string,
        trainer_id: string
}
export interface coupUncoup{
    category: string;
    pullUps_cou: string,
        encroach_cou: string,
        goal_cou: string,
        finalPosition_cou: string,
        straightLineBacking_cou: string,
        straightLineBackingInput_cou: string,
        alleyDocking_cou: string,
        alleyDockingInput_cou: string,
        offSetBacking_cou: string,
        offSetBackingInput_cou: string,
        parallelParkingBlind_cou: string,
        parallelParkingBlindInput_cou: string,
        coupUncoup_cou: string,
        coupUncoupInput_cou: string,
        comments_cou: string,
        satisfactoryCoupUncoup:string,
        unSatisfactoryCoupUncoup:string,
        trainer_id: string
}
export interface roadSkills{
    trainer_id?: string;
    trainee_id: string;
    supervisor_id: string;
    city: string;
    state: string;
    evaluation_form: string;
    is_completed_cdl_classroom: string;
    is_completed_group_practical: string
    category?: string;
    clp?: string;
    odometerEndingMiles?: string;
    odometerStartingMiles?: string;
    truckId?: string;
}
export interface roadSkillsDigital{
    category: string;
    leftTurns: string,
    leftTurnsInput: string,
    rightTurns: string,
    rightTurnsInput: string,
    intersectionStop: string,
    intersectionStopInput: string,
    intersectionThru: string,
    intersectionThruInput: string,
    interstate: string,
    interstateInput: string,
    urbanBusiness: string,
    urbanBusinessInput: string,
    lanceChanges: string,
    lanceChangesInput: string,
    curve: string,
    curveInput: string,
    roadside: string,
    roadsideInput: string,
    rrCrossing: string,
    rrCrossingInput: string,
    signs: string,
    signsInput: string,
    generalDriving: string,
    generalDrivingInput: string,
    eLogPractical: string,
    eLogPracticalInput: string,
    satisfactoryRoadTesting:string,
      unSatisfactoryRoadTesting:string,
      trainer_id: string,
      sumRoadSkills:string,
      finalResultRoadSkills: string
}