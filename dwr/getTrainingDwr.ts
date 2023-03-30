
export function GetTrainingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation, taskId: any, module: any,type) {

    let getDwr = ``;

    let where = ``;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr_employees.created_at) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr_employees.created_at) = '${year}'`
    }
    else {
        where = `${where} AND CAST(dwr_employees.created_at AS Date) = '${date}'`
    }

    
     if (operation === 'getDWR' && type === 'getAssignedDWR') {
        getDwr = `
    select 
    DISTINCT dwr_employees."id" as dwr_id,
    dwr.dwr_type,
    dwr_employees.created_at
    
    from 
    
    "Bridge_DailyTasks_DWR" bridge 
    INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
    INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
    INNER JOIN "Training" training ON dwr.training_record_id = training."id"

    WHERE 
    dwr.is_day_closed= TRUE
    AND training.supervisor_id = '${employee_id}'
    ${where}
    ;
    
    select 
    DISTINCT dwr_employees."id" as dwr_id,
    dwr.dwr_type,
    dwr_employees.created_at
    
    from 
    
    "Bridge_DailyTasks_DWR" bridge 
    INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
    INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
    INNER JOIN "Trainee" trainee ON dwr.trainee_record_id = trainee."id"

    WHERE 
    dwr.is_day_closed= TRUE
    AND trainee.trainer_id = '${employee_id}'
    ${where}
    ;

    select 
    DISTINCT dwr_employees."id" as dwr_id,
    dwr.dwr_type,
    dwr_employees.created_at
    
    from 
    
    "Bridge_DailyTasks_DWR" bridge 
    INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
    INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
    INNER JOIN "Trainer_Training_Tasks" trainer_task ON dwr.trainer_record_id = trainer_task."id"

    WHERE 
    dwr.is_day_closed= TRUE
    AND trainer_task.supervisor_id = '${employee_id}'
    ${where}
    ;

    `;
    }
    else if(operation === 'getDWR' && type === 'getMyDWR'){
            getDwr = `
        select 
        DISTINCT dwr_employees."id" as dwr_id,
        dwr.dwr_type,
        concat(e.first_name, ' ', e.last_name) as employee_name,
        dwr_employees.created_at
        
        from 
        
        "Bridge_DailyTasks_DWR" bridge 
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Training" training ON dwr.training_record_id = training."id"
        INNER JOIN "Employees" e ON CAST(e."id" as VARCHAR) = dwr_employees.employee_id 

        WHERE 
        dwr.is_day_closed= TRUE
        AND dwr.employee_id = '${employee_id}'
        ${where}
        ;
        
        select 
        DISTINCT dwr_employees."id" as dwr_id,
        dwr.dwr_type,
        concat(e.first_name, ' ', e.last_name) as employee_name,
        dwr_employees.created_at
        
        from 
        
        "Bridge_DailyTasks_DWR" bridge 
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Trainee" trainee ON dwr.trainee_record_id = trainee."id"
       INNER JOIN "Employees" e ON CAST(e."id" as VARCHAR) = dwr_employees.employee_id 

    
        WHERE 
        dwr.is_day_closed= TRUE
        AND dwr.employee_id = '${employee_id}'
        ${where}
        ;
    
        select 
        DISTINCT dwr_employees."id" as dwr_id,
        dwr.dwr_type,
        concat(e.first_name, ' ', e.last_name) as employee_name,
        dwr_employees.created_at
        
        from 
        
        "Bridge_DailyTasks_DWR" bridge 
        INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id"
        INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
        INNER JOIN "Trainer_Training_Tasks" trainer_task ON dwr.trainer_record_id = trainer_task."id"              INNER JOIN "Employees" e ON CAST(e."id" as VARCHAR) = dwr_employees.employee_id 

        WHERE 
        dwr.is_day_closed= TRUE
        AND dwr.employee_id = '${employee_id}'
        ${where}
        ;
    
        `;
    }

     if (operation === 'getTasks' && module === 'training') {
        getDwr = `
        select bridge.dwr_id,bridge.task_id, dwr.dwr_type, dwr.status, dwr.notes from 
    "Bridge_DailyTasks_DWR" bridge
    INNER JOIN "DWR_Employees" dwr_employees ON bridge.dwr_id = dwr_employees."id" AND bridge.dwr_id = '${taskId}'
    INNER JOIN "DWR" dwr ON bridge.task_id = dwr."id"
    WHERE (dwr.status IS NULL OR dwr.status = 'reassigned' OR dwr.status = '')
        ;`
    }

    else if (operation === 'getTicketData' && module === 'training') {
        getDwr = `
        select 
        training."id",
emp.id as "trainer_id",
concat(emp."first_name", ' ', emp."last_name") as "trainer_name",
emp2.id as "trainee_id",
concat(emp2."first_name", ' ', emp2."last_name") as "trainee_name",
training."city",
training."state",
training."training_type",
training."topic",
training."detail",
emp3.id as "supervisor_id",
concat(emp3."first_name", ' ', emp3."last_name") as "supervisor_name",
training."notes",
training."evaluation_form",
training."is_completed_cdl_classroom",
training."is_completed_group_practical",
training."evaluation_type",
training."created_at",
training."is_digital_form_started",
training."is_engine_compartment_started",
training."is_in_cab_started",
training."is_coupling_started",
training."is_suspension_brakes_started",
training."airCompresseorEngine",
training."alternatorBelt",
training."clutchCondition",
training."clutchCondition",
training."coolantLevelEngine",
training."fanShroud",
training."h20",
training."hosesSteering",
training."leaksHoses",
training."mirror",
training."oilLevel",
training."powerSteelingLevel",
training."radiator",
training."steeringBox",
training."steeringLinkage",
training."turbo",
training."windowFluid",
training."wiring",
training."safetyBelt",
training."coolantLevelCab",
training."emergencyEquipment",
training."safeStart",
training."temperatureGauge",
training."oilPressure",
training."voltMeter",
training."airGaugeBuCo",
training."indicators",
training."horns",
training."defroster",
training."windshield",
training."wipersWash",
training."parkBrake",
training."svcBrake",
training."leakTest",
training."abcLights",
training."commentsCab",
training."category",
training."lightFunctionVehicle",
training."lensReflector",
training."door",
training."fuelTank",
training."leaks",
training."steps",
training."steps",
training."driveShaft",
training."tires",
training."rims",
training."lugNuts",
training."axelHubSeal",
training."bidSpacers",
training."batteryBox",
training."exhaust",
training."headerBvd",
training."landingGear",
training."commentsVehicle",
training."airConditioners",
training."electricConnectors",
training."mountingBolts",
training."platformBase",
training."lockingJaws",
training."grease",
training."releaseArm",
training."skidPlate",
training."slidingPins",
training."kingPin",
training."apron",
training."gap",
training."airLine",
training."location",
training."safetyDevices",
training."print",
training."drawBar",
training."commentsCoupling",
training."springs",
training."airBags",
training."shocks",
training."mounts",
training."bushings",
training."leafSprings",
training."slackAdjusters",
training."crackChammber",
training."pushRod",
training."drums",
training."linings",
training."rotor",
training."discPads",
training."brakeHoses",
training."cams",
training."torqueArm",
training."wheelSeals",
training."commentsSuspension",
training."clp",
training."odometerEndingMiles",
training."odometerStartingMiles",
training."truckId",
training."is_straight_line_backing_started",
training."is_alley_backing_started",
training."is_off_set_backing_started",
training."is_parking_blind_started",
training."is_coup_uncoup_started",
training."pullUpsInput_slb",
training."encroachInput_slb",
training."goal_slb",
training."finalPosition_slb",
training."straightLineBacking_slb",
training."straightLineBakingInput_slb",
training."alleyDocking_slb",
training."alleyDockingInput_slb",
training."offSetBacking_slb",
training."offSetBackingInput_slb",
training."parallelParkingBlind_slb",
training."parallelParkingBlindInput_slb",
training."coupUncoup_slb",
training."coupUncoupInput_slb",
training."comments_slb",
training."pullUpsInput_ad",
training."encroachInput_ad",
training."goal_ad",
training."finalPosition_ad",
training."straightLineBacking_ad",
training."straightLineBakingInput_ad",
training."alleyDocking_ad",
training."alleyDockingInput_ad",
training."offSetBacking_ad",
training."offSetBackingInput_ad",
training."parallelParkingBlind_ad",
training."parallelParkingBlindInput_ad",
training."coupUncoup_ad",
training."coupUncoupInput_ad",
training."comments_ad",
training."pullUps_osb",
training."encroach_osb",
training."goal_osb",
training."finalPosition_osb",
training."straightLineBaking_osb",
training."straightLineBakingInput_osb",
training."alleyDocking_osb",
training."alleyDockingInput_osb",
training."offSetBacking_osb",
training."parallelParkingBlind_osb",
training."parallelParkingBlindInput_osb",
training."coupUncoup_osb",
training."coupUncoupInput_osb",
training."comments_osb",
training."pullUps_pb",
training."encroach_pb",
training."goal_pb",
training."finalPosition_pb",
training."straightLineBaking_pb",
training."straightLineBakingInput_pb",
training."alleyDocking_pb",
training."alleyDockingInput_pb",
training."offSetBacking_pb",
training."offSetBackingInput_pb",
training."parallelParkingBlind_pb",
training."parallelParkingBlindInput_pb",
training."coupUncoup_pb",
training."coupUncoupInput_pb",
training."comments_pb",
training."pullUps_ps",
training."encroach_ps",
training."goal_ps",
training."finalPosition_ps",
training."straightLineBaking_ps",
training."straightLineBakingInput_ps",
training."alleyDocking_ps",
training."alleyDockingInput_ps",
training."offSetBacking_ps",
training."offSetBackingInput_ps",
training."parallelParkingBlind_ps",
training."parallelParkingBlindInput_ps",
training."coupUncoup_ps",
training."coupUncoupInput_ps",
training."comments_ps",
training."pullUps_cou",
training."encroach_cou",
training."goal_cou",
training."finalPosition_cou",
training."straightLineBacking_cou",
training."straightLineBackingInput_cou",
training."alleyDocking_cou",
training."alleyDockingInput_cou",
training."offSetBacking_cou",
training."offSetBackingInput_cou",
training."parallelParkingBlind_cou",
training."parallelParkingBlindInput_cou",
training."coupUncoup_cou",
training."coupUncoupInput_cou",
training."comments_cou",
training."leftTurns",
training."leftTurnsInput",
training."rightTurns",
training."rightTurnsInput",
training."intersectionStop",
training."intersectionStopInput",
training."intersectionThru",
training."intersectionThruInput",
training."interstate",
training."interstateInput",
training."urbanBusiness",
training."urbanBusinessInput",
training."lanceChanges",
training."lanceChangesInput",
training."curve",
training."curveInput",
training."roadside",
training."roadsideInput",
training."rrCrossing",
training."rrCrossingInput",
training."signs",
training."signsInput",
training."generalDriving",
training."generalDrivingInput",
training."eLogPractical",
training."eLogPracticalInput",
training."satisfactoryRoadTesting",
training."unSatisfactoryRoadTesting",
training."satisfactoryStraightLineBacking",
training."unSatisfactoryStraightLineBacking",
training."unSatisfactoryAlleyDocking",
training."satisfactoryOffSetBacking",
training."unSatisfactoryOffSetBacking",
training."satisfactoryParkingBlind",
training."unSatisfactoryParkingBlind",
training."satisfactoryParkingSight",
training."unSatisfactoryParkingSight",
training."satisfactoryCoupUncoup",
training."unSatisfactoryCoupUncoup",
training."percentageEngineCompartment",
training."percentageInCab",
training."percentageVehicleExternal",
training."percentageCoupling",
training."percentageSuspension",
training."endDateRoadSkill",
training."endDatePreTrip",
training."endDateBasicSkill",
training."image_1",
training."image_2",
training."image_3"

        from
        "DWR" dwr 
        INNER JOIN "Training" training ON dwr."training_record_id" = training."id" AND dwr.id = '${taskId}'
        INNER JOIN "Employees" emp ON emp."id" = training.trainer_id
        INNER JOIN "Employees" emp2 ON emp2."id" = training.trainee_id
        INNER JOIN "Employees" emp3 ON emp3."id" = training.supervisor_id
        ;
        
        select 
        emp."id" as trainee_id,
        concat(emp.first_name, ' ', emp.last_name) as trainee_name,
        empTrainer."id" as trainer_id,
        concat(empTrainer.first_name, ' ', empTrainer.last_name) as trainer_name,
        trainee.city,
        trainee."state",
        trainee.training_type,
        trainee.image_1,
        trainee.image_2,
        trainee.image_3

        from
        "DWR" dwr 
        INNER JOIN "Trainee" trainee ON dwr.trainee_record_id = trainee."id" AND dwr.id = '${taskId}'
        INNER JOIN "Employees" emp ON emp."id" = trainee.trainee_id
		INNER JOIN "Employees" empTrainer ON empTrainer."id" = trainee.trainer_id

        ;
        
        select 
        
        emp."id" as trainer_id, 
        concat(emp.first_name, ' ', emp.last_name) as trainer_name,
        emp2."id" as supervisor_id, 
        concat(emp2.first_name, ' ', emp2.last_name) as supervisor_name,
        trainer_task.city,
        trainer_task."state",
        trainer_task.training_type,
        trainer_task.notes,
        trainer_task.topic,
        trainer_task.image_1,
        trainer_task.image_2,
        trainer_task.image_3
        
        from
        "DWR" dwr 
        INNER JOIN "Trainer_Training_Tasks" trainer_task ON dwr.trainer_record_id = trainer_task."id" AND dwr.id = '${taskId}'
        INNER JOIN "Employees" emp ON emp."id" = trainer_task.trainer_id
        INNER JOIN "Employees" emp2 ON emp2."id" = trainer_task.supervisor_id
        ;
      
        `
    }

    return getDwr;
}