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
    category: string;
  airCompresseorEngine: string;
  alternatorBelt: string;
  clutchCondition: string;
  commentsEngine: "";
  coolantLevelEngine: string;
  fanShroud: string;
  h20: string;
  hosesSteering: string;
  leaksHoses: string;
  mirror: string;
  oilLevel: string;
  powerSteelingLevel: string;
  radiator: string;
  steeringBox: string;
  steeringLinkage: string;
  turbo: string;
  windowFluid: string;
  wiring: string;
  percentageEngineCompartment: string;
}
export interface inCab {
    category: string;
    safetyBelt: string,
    coolantLevelCab: string,
    emergencyEquipment: string,
    safeStart: string,
    temperatureGauge: string,
    oilPressure: string,
    voltMeter: string,
    airGaugeBuCo: string,
    indicators: string,
    horns: string,
    defroster: string,
    windshield: string,
    wipersWash: string,
    parkBrake: string,
    svcBrake: string,
    leakTest: string,
    abcLights: string,
    lightFunction: string,
    commentsCab: string,
    percentageInCab: string;

}
export interface vehicleExternal {
    category: string;
    lightFunctionVehicle: string
      lensReflector: string
      door: string
      fuelTank: string
      leaks: string
      steps: string
      frame: string
      driveShaft: string
      tires: string
      rims: string
      lugNuts: string
      axelHubSeal: string
      bidSpacers: string
      batteryBox: string
      exhaust: string
      headerBvd: string
      landingGear: string
      commentsVehicle: string,
      percentageVehicleExternal: string,
}
export interface coupling {
    category: string;
    airConditioners: string,
    electricConnectors: string,
    mountingBolts: string,
    platformBase: string,
    lockingJaws: string,
    grease: string,
    releaseArm: string,
    skidPlate: string,
    slidingPins: string,
    kingPin: string,
    apron: string,
    gap: string,
    airLine: string,
    location: string,
    safetyDevices: string,
    print: string,
    drawBar: string,
    commentsCoupling: string,
    percentageCoupling: string
}
export interface suspensionBrakes{
    category: string;
    springs: string,
    airBags: string,
    shocks: string,
    vBolts: string,
    mounts: string,
    bushings: string,
    leafSprings: string,
    slackAdjusters: string,
    crackChammber: string,
    pushRod: string,
    drums: string,
    linings: string,
    rotor: string,
    discPads: string,
    brakeHoses: string,
    cams: string,
    torqueArm: string,
    wheelSeals: string,
    commentsSuspension: string,
    percentageSuspension: string
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
}