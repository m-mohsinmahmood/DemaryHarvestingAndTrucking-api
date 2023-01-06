import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const order: beginningOfDay = req.body;

    let optionalReq: string = ``;
    let optionalValues: string = ``;

    if (order.machineryId != null) {
      optionalReq = `${optionalReq},"machinery_id"`;
      optionalValues = `${optionalValues},'${order.machineryId}'`;
    }

    if (order.workOrderId != null) {
      optionalReq = `${optionalReq},"work_order_id"`;
      optionalValues = `${optionalValues},'${order.workOrderId}'`;
    }

    if (order.beginningEngineHours != null) {
      optionalReq = `${optionalReq},"beginning_engine_hours"`;
      optionalValues = `${optionalValues},'${order.beginningEngineHours}'`;
    }

    if (order.beginning_separator_hours != null) {
      optionalReq = `${optionalReq},"beginning_separator_hours"`;
      optionalValues = `${optionalValues},'${order.beginning_separator_hours}'`;
    }

    if (order.field_id != null) {
      optionalReq = `${optionalReq},"field_id"`;
      optionalValues = `${optionalValues},'${order.field_id}'`;
    }
    if (order.field_acres != null) {
        optionalReq = `${optionalReq},"field_acres"`;
        optionalValues = `${optionalValues},'${order.field_acres}'`;
      }
      if (order.truck_id != null) {
        optionalReq = `${optionalReq},"truck_id"`;
        optionalValues = `${optionalValues},'${order.truck_id}'`;
      }
      if (order.crew_chief != null) {
        optionalReq = `${optionalReq},"crew_chief"`;
        optionalValues = `${optionalValues},'${order.crew_chief}'`;
      }
      if (order.truck_company != null) {
        optionalReq = `${optionalReq},"truck_company"`;
        optionalValues = `${optionalValues},'${order.truck_company}'`;
      }
      if (order.begining_odometer_miles != null) {
        optionalReq = `${optionalReq},"begining_odometer_miles"`;
        optionalValues = `${optionalValues},'${order.begining_odometer_miles}'`;
      }
      // if (order.job_id != null) {
      //   optionalReq = `${optionalReq},"job_id"`;
      //   optionalValues = `${optionalValues},'${order.job_id}'`;
      // }
    // if (order.total_acres != null) {
    //   optionalReq = `${optionalReq},"total_acres"`;
    //   optionalValues = `${optionalValues},'${order.total_acres}'`;
    // }
    // if (order.total_gps_acres != null) {
    //   optionalReq = `${optionalReq},"total_gps_acres"`;
    //   optionalValues = `${optionalValues},'${order.total_gps_acres}'`;
    // }

    let query = ``;

    query = `
            INSERT INTO 
                        "DWR" 
                        ("employee_id",
                        "dwr_type"
                        ${optionalReq})
      
            VALUES      ('${order.employeeId}',
                        '${order.dwr_type}'
                        ${optionalValues});
          `;

    console.log('DWR Post',query);

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "DWR has been created successfully",
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
