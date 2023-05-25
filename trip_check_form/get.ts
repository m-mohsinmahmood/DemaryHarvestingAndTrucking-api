import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const employeeId: string = req.query.employeeId;
    const requestType: string = req.query.requestType;
    const date: string = req.query.date;
    const month: string = req.query.month;
    const year: string = req.query.year;
    const startDate: string = req.query.startDate;
    const endDate: string = req.query.endDate;


    try {

        let whereClause: string = `WHERE ptc."is_deleted" = false`;

        let ticket = ``;

        let select = `ptc."id",
        ptc."beginning_at" as created_at,
        emp.first_name as inspected_by,
                                     
        SUM(CASE WHEN ptc."airCompressorEngine" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."beltsHoses" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."clutchCondition" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."fluidLvl" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."oilLvl" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."radiator" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."steering" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."gauges" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."heater" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."horns" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."leakTest" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."lightsCab" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."oilPressure" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."pBrakes" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."sBrakes" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."safetyEquip" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."starter" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."windows" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."wipers" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."batteryBox" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."driveLine" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."exhaust" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."frameAssembly" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."fuelTank" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."lightsReflectors" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."lugNuts" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."mirrors" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."tiresChains" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."wheelsRims" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."airLine" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."brakeAccessories" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."fifthWheel" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."frontAxle" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."muffler" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."rearEnd" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."suspensionSystem" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."transmission" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."couplingDevicesTrailer" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."brakeConnections" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."brakes" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."coupling" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."couplingDevices" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."doors" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."hitch" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."landingGear" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."lights" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."reflectors" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."roof" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."suspension" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."tarpaulin" = false THEN 1 ELSE 0 END)+
        SUM(CASE WHEN ptc."tires" = false THEN 1 ELSE 0 END) as unsatisfactory_items
        
        FROM 
                 "Pre_Trip_Check" ptc 
                  INNER JOIN "Employees" emp
                  on ptc.employee_id = emp.id
        `

        if (requestType === 'all') {
            console.log("ALL");

            ticket = `
            SELECT 
                  ${select}
   
                  
                  ${whereClause}  AND ptc."employee_id" = '${employeeId}'
                  AND ptc.is_ticket_active=FALSE AND ptc."is_ticket_completed" = TRUE
              
                  GROUP BY ptc."id", ptc."created_at", emp."first_name"
                  ORDER BY ptc."created_at" ;
      `;
        }

        else if (requestType === 'day') {
            console.log("Day");
            ticket = `
            Select ${select} ${whereClause}  AND ptc."employee_id" = '${employeeId}' 
            AND ptc.beginning_at > '${startDate}'::timestamp AND ptc.beginning_at < '${endDate}'::timestamp
            AND ptc.is_ticket_active=FALSE AND ptc."is_ticket_completed" = TRUE
            GROUP BY ptc."id", emp."first_name"; 
            `;
        }

        else if (requestType === 'month') {
            console.log("Month");
            ticket = `
            Select ${select} ${whereClause}  AND ptc."employee_id" = '${employeeId}' AND EXTRACT(MONTH FROM ptc."created_at") = '${month}' AND EXTRACT(YEAR FROM ptc."created_at") = '${year}'
            AND ptc.is_ticket_active=FALSE AND ptc."is_ticket_completed" = TRUE
            GROUP BY ptc."id", emp."first_name"; 
            `;
        }

        else if (requestType === 'year') {
            console.log("Year");
            ticket = `
            Select ${select} ${whereClause}  AND ptc."employee_id" = '${employeeId}' AND EXTRACT(YEAR FROM ptc."created_at") = '${year}'
            AND ptc.is_ticket_active=FALSE AND ptc."is_ticket_completed" = TRUE
            GROUP BY ptc."id", emp."first_name"; 
            `;
        }

        let query = `${ticket} `;

        console.log(query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            ticket: result.rows
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
