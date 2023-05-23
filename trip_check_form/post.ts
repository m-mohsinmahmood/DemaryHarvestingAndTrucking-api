import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { PreCheckForm } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const tripForm: PreCheckForm = req.body;

        let query = ``;

        switch (tripForm.category) {
            case 1:
                query = `
                INSERT INTO 
                            "Pre_Trip_Check" 
                            ("truck_Id", 
                            "trailer_Id", 
                            "employee_id", 
                            "is_category1_completed",
                            "is_ticket_active",

                            "airCompressorEngine",
                            "airCompressorEngineNotes", 
                            "airCompressorEngineSeverity", 
                            
                            "beltsHoses",
                            "beltsHosesNotes",
                            "beltsHosesSeverity",
                            
                            "clutchCondition",
                            "clutchConditionNotes",
                            "clutchConditionSeverity",

                            "fluidLvl",
                            "fluidLvlNotes",
                            "fluidLvlSeverity",

                            "oilLvl",
                            "oilLvlNotes",
                            "oilLvlSeverity",

                            "radiator",
                            "radiatorNotes",
                            "radiatorSeverity",

                            "steering",
                            "steeringNotes",
                            "steeringSeverity"
                          )
          
                VALUES      ('${tripForm.truckNo}', 
                            '${tripForm.trailerNo}', 
                            '${tripForm.employeeId}', 
                            'true', 
                            'true',

                            '${tripForm.airCompressorEngine}',
                            $$${tripForm.airCompressorEngineNotes}$$, 
                            '${tripForm.airCompressorEngineSeverity}', 
                            
                            '${tripForm.beltsHoses}',
                            $$${tripForm.beltsHosesNotes}$$,
                            '${tripForm.beltsHosesSeverity}',
                           
                            '${tripForm.clutchCondition}',
                            $$${tripForm.clutchConditionNotes}$$, 
                            '${tripForm.clutchConditionSeverity}', 
                           
                            '${tripForm.fluidLvl}',
                            $$${tripForm.fluidLvlNotes}$$,
                            '${tripForm.fluidLvlSeverity}',
                           
                            '${tripForm.oilLvl}',
                            $$${tripForm.oilLvlNotes}$$, 
                            '${tripForm.oilLvlSeverity}', 
                        
                            '${tripForm.radiator}',
                            $$${tripForm.radiatorNotes}$$,
                            '${tripForm.radiatorSeverity}',
                          
                            '${tripForm.steering}',
                            $$${tripForm.steeringNotes}$$,
                            '${tripForm.steeringSeverity}'
                            );
              `;
                break;
            //////////////////////////////////////////////////////
            case 2:
                query = `
                    UPDATE
                            "Pre_Trip_Check" 
                            SET 
                            "is_category2_completed" = 'TRUE',
                            "gauges" = '${tripForm.gauges}',
                            "gaugesNotes" = '${tripForm.gaugesNotes}',
                            "gaugesSeverity" = '${tripForm.gaugesSeverity}',
                            "heater" = '${tripForm.heater}',
                            "heaterNotes" = '${tripForm.heaterNotes}',
                            "heaterSeverity" = '${tripForm.heaterSeverity}',
                            "horns" = '${tripForm.horns}',
                            "hornsNotes" = '${tripForm.hornsNotes}',
                            "hornsSeverity" = '${tripForm.hornsSeverity}',
                            "leakTest" = '${tripForm.leakTest}',
                            "leakTestNotes" = '${tripForm.leakTestNotes}',
                            "leakTestSeverity" = '${tripForm.leakTestSeverity}',
                            "lightsCab" = '${tripForm.lightsCab}',
                            "lightsNotesCab" = '${tripForm.lightsNotesCab}',
                            "lightsSeverityCab" = '${tripForm.lightsSeverityCab}',
                            "oilPressure" = '${tripForm.oilPressure}',
                            "oilPressureNotes" = '${tripForm.oilPressureNotes}',
                            "oilPressureSeverity" = '${tripForm.oilPressureSeverity}',
                            "pBrakes" = '${tripForm.pBrakes}',
                            "pBrakesNotes" = '${tripForm.pBrakesNotes}',
                            "pBrakesSeverity" = '${tripForm.pBrakesSeverity}',
                            "sBrakes" = '${tripForm.sBrakes}',
                            "sBrakesNotes" = '${tripForm.sBrakesNotes}',
                            "sBrakesSeverity" = '${tripForm.sBrakesSeverity}',
                            "safetyEquip" = '${tripForm.safetyEquip}',
                            "safetyEquipNotes" = '${tripForm.safetyEquipNotes}',
                            "safetyEquipSeverity" = '${tripForm.safetyEquipSeverity}',
                            "starter" = '${tripForm.starter}',
                            "starterNotes" = '${tripForm.starterNotes}',
                            "starterSeverity" = '${tripForm.starterSeverity}',
                            "windows" = '${tripForm.windows}',
                            "windowsNotes" = '${tripForm.windowsNotes}',
                            "windowsSeverity" = '${tripForm.windowsSeverity}',
                            "wipers" = '${tripForm.wipers}',
                            "wipersNotes" = '${tripForm.wipersNotes}',
                            "wipersSeverity" = '${tripForm.wipersSeverity}'

                            WHERE 
                            "id" = '${tripForm.ticketId}';
                  `;
                break;
            /////////////////////////////////////////////////////////
            case 3:
                query = `
                    UPDATE
                            "Pre_Trip_Check" 
                            SET 
                            "is_category3_completed" = 'TRUE',
                            "batteryBox" = '${tripForm.batteryBox}',
                            "batteryBoxNotes" = $$${tripForm.batteryBoxNotes}$$,
                            "batteryBoxSeverity" = '${tripForm.batteryBoxSeverity}',
                            "driveLine"       = '${tripForm.driveLine}', 
                            "driveLineNotes"       = $$${tripForm.driveLineNotes}$$, 
                            "driveLineSeverity"       = '${tripForm.driveLineSeverity}', 
                            "exhaust"       = '${tripForm.exhaust}', 
                            "exhaustNotes"       = $$${tripForm.exhaustNotes}$$, 
                            "exhaustSeverity"       = '${tripForm.exhaustSeverity}', 
                            "frameAssembly"       = '${tripForm.frameAssembly}', 
                            "frameAssemblyNotes"       = $$${tripForm.frameAssemblyNotes}$$, 
                            "frameAssemblySeverity"       = '${tripForm.frameAssemblySeverity}', 
                            "fuelTank"       = '${tripForm.fuelTank}', 
                            "fuelTankNotes"       = $$${tripForm.fuelTankNotes}$$, 
                            "fuelTankSeverity"       = '${tripForm.fuelTankSeverity}', 
                            "lightsReflectors"       = '${tripForm.lightsReflectors}', 
                            "lightsReflectorsNotes"       = $$${tripForm.lightsReflectorsNotes}$$, 
                            "lightsReflectorsSeverity"       = '${tripForm.lightsReflectorsSeverity}', 
                            "lugNuts"       = '${tripForm.lugNuts}', 
                            "lugNutsNotes"       = $$${tripForm.lugNutsNotes}$$, 
                            "lugNutsSeverity"       = '${tripForm.lugNutsSeverity}', 
                            "mirrors"       = '${tripForm.mirrors}', 
                            "mirrorsNotes"       = $$${tripForm.mirrorsNotes}$$, 
                            "mirrorsSeverity"       = '${tripForm.mirrorsSeverity}', 
                            "tiresChains"       = '${tripForm.tiresChains}', 
                            "tiresChainsNotes"       = $$${tripForm.tiresChainsNotes}$$, 
                            "tiresChainsSeverity"       = '${tripForm.tiresChainsSeverity}', 
                            "wheelsRims"       = '${tripForm.wheelsRims}', 
                            "wheelsRimsNotes"       = $$${tripForm.wheelsRimsNotes}$$, 
                            "wheelsRimsSeverity"       = '${tripForm.wheelsRimsSeverity}'

                            WHERE 
                            "id" = '${tripForm.ticketId}';
                  `;
                break;
            ///////////////////////////////
            case 4:
                query = `
                    UPDATE
                            "Pre_Trip_Check" 
                            SET 
                           
                            "is_category4_completed" = 'TRUE',
                            "airLine"       = '${tripForm.airLine}', 
                            "airLineNotes"       = $$${tripForm.airLineNotes}$$, 
                            "airLineSeverity"       = '${tripForm.airLineSeverity}', 
                            "brakeAccessories"       = '${tripForm.brakeAccessories}', 
                            "brakeAccessoriesNotes"       = $$${tripForm.brakeAccessoriesNotes}$$, 
                            "brakeAccessoriesSeverity"       = '${tripForm.brakeAccessoriesSeverity}', 
                            "couplingDevices"       = '${tripForm.couplingDevices}', 
                            "couplingDevicesNotes"       = $$${tripForm.couplingDevicesNotes}$$, 
                            "couplingDevicesSeverity"       = '${tripForm.couplingDevicesSeverity}', 
                            "fifthWheel"       = '${tripForm.fifthWheel}', 
                            "fifthWheelNotes"       = $$${tripForm.fifthWheelNotes}$$, 
                            "fifthWheelSeverity"       = '${tripForm.fifthWheelSeverity}', 
                            "frontAxle"       = '${tripForm.frontAxle}', 
                            "frontAxleNotes"       = $$${tripForm.frontAxleNotes}$$, 
                            "frontAxleSeverity"       = '${tripForm.frontAxleSeverity}', 
                            "muffler"       = '${tripForm.muffler}', 
                            "mufflerNotes"       = $$${tripForm.mufflerNotes}$$, 
                            "mufflerSeverity"       = '${tripForm.mufflerSeverity}', 
                            "rearEnd"       = '${tripForm.rearEnd}', 
                            "rearEndNotes"       = $$${tripForm.rearEndNotes}$$, 
                            "rearEndSeverity"       = '${tripForm.rearEndSeverity}', 
                            "suspensionSystem"       = '${tripForm.suspensionSystem}', 
                            "suspensionSystemNotes"       = $$${tripForm.suspensionSystemNotes}$$, 
                            "suspensionSystemSeverity"       = '${tripForm.suspensionSystemSeverity}', 
                            "transmission"       = '${tripForm.transmission}', 
                            "transmissionNotes"       = $$${tripForm.transmissionNotes}$$, 
                            "transmissionSeverity"       = '${tripForm.transmissionSeverity}'

                            WHERE 
                            "id" = '${tripForm.ticketId}';
                  `;
                break;
            //////////////////////
            case 5:
                query = `
                    UPDATE
                            "Pre_Trip_Check" 
                            SET 
          
                            "is_category5_completed" = 'TRUE',
                            "brakeConnections"       = '${tripForm.brakeConnections}', 
                            "brakeConnectionsNotes"       = $$${tripForm.brakeConnectionsNotes}$$, 
                            "brakeConnectionsSeverity"       = '${tripForm.brakeConnectionsSeverity}', 
                            "brakes"       = '${tripForm.brakes}', 
                            "brakesNotes"       = $$${tripForm.brakesNotes}$$, 
                            "brakesSeverity"       = '${tripForm.brakesSeverity}', 
                            "couplingDevicesTrailer"       = '${tripForm.couplingDevicesTrailer}', 
                            "couplingDevicesNotesTrailer"       = $$${tripForm.couplingDevicesNotesTrailer}$$, 
                            "couplingDevicesSeverityTrailer"       = '${tripForm.couplingDevicesSeverityTrailer}', 
                            "coupling"       = '${tripForm.coupling}', 
                            "couplingNotes"       = $$${tripForm.couplingNotes}$$, 
                            "couplingSeverity"       = '${tripForm.couplingSeverity}', 
                            "doors"       = '${tripForm.doors}', 
                            "doorsNotes"       = $$${tripForm.doorsNotes}$$, 
                            "doorSeverity"       = '${tripForm.doorSeverity}', 
                            "hitch"       = '${tripForm.hitch}', 
                            "hitchNotes"       = $$${tripForm.hitchNotes}$$, 
                            "hitchSeverity"       = '${tripForm.hitchSeverity}', 
                            "landingGear"       = '${tripForm.landingGear}', 
                            "landingGearNotes"       = $$${tripForm.landingGearNotes}$$, 
                            "landingGearSeverity"       = '${tripForm.landingGearSeverity}', 
                            "lights"       = '${tripForm.lights}', 
                            "lightsNotes"       = $$${tripForm.lightsNotes}$$, 
                            "lightsSeverity"       = '${tripForm.lightsSeverity}', 
                            "reflectors"       = '${tripForm.reflectors}', 
                            "reflectorsNotes"       = $$${tripForm.reflectorsNotes}$$, 
                            "reflectorsSeverity"       = '${tripForm.reflectorsSeverity}', 
                            "roof"       = '${tripForm.roof}', 
                            "roofNotes"       = $$${tripForm.roofNotes}$$, 
                            "roofSeverity"       = '${tripForm.roofSeverity}', 
                            "suspension"       = '${tripForm.suspension}', 
                            "suspensionNotes"       = $$${tripForm.suspensionNotes}$$, 
                            "suspensionSeverity"       = '${tripForm.suspensionSeverity}', 
                            "tarpaulin"       = '${tripForm.tarpaulin}', 
                            "tarpaulinNotes"       = $$${tripForm.tarpaulinNotes}$$, 
                            "tarpaulinSeverity"       = '${tripForm.tarpaulinSeverity}', 
                            "tires"       = '${tripForm.tires}', 
                            "tiresNotes"       = $$${tripForm.tiresNotes}$$, 
                            "tiresSeverity"       = '${tripForm.tiresSeverity}',
                            "is_ticket_active" = 'FALSE',
                            "is_ticket_completed" = 'TRUE',
                            "delivery_ticket_id" = '${tripForm.deliveryTicketId}'

                            WHERE 
                            "id" = '${tripForm.ticketId}';
                  `;
                break;
            //////////////////////
            default:
                break;
        }



        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Delivery Ticket of trucking has been created successfully",
            },
        };

        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                status: 500,
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
