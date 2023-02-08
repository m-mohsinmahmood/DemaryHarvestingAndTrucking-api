import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { JobResult } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const jobResult: JobResult = req.body;
        console.log(jobResult);

        let optionalReq: string = ``;
        let optionalValues: string = ``;

        if (jobResult.service != null) {
            optionalReq = `${optionalReq},"service"`;
            optionalValues = `${optionalValues},'${jobResult.service}'`
        }

        if (jobResult.customer_name != null) {
            optionalReq = `${optionalReq},"customer_name"`;
            optionalValues = `${optionalValues},'${jobResult.customer_name}'`
        }

        if (jobResult.farm_name != null) {
            optionalReq = `${optionalReq},"farm_name"`;
            optionalValues = `${optionalValues},'${jobResult.farm_name}'`
        }

        if (jobResult.field_name != null) {
            optionalReq = `${optionalReq},"field_name"`;
            optionalValues = `${optionalValues},'${jobResult.field_name}'`
        }

        if (jobResult.acres != null) {
            optionalReq = `${optionalReq},"acres"`;
            optionalValues = `${optionalValues},'${jobResult.acres}'`
        }

        if (jobResult.gps_acres != null) {
            optionalReq = `${optionalReq},"gps_acres"`;
            optionalValues = `${optionalValues},'${jobResult.gps_acres}'`
        }

        if (jobResult.engine_hours != null) {
            optionalReq = `${optionalReq},"engine_hours"`;
            optionalValues = `${optionalValues},'${jobResult.engine_hours}'`
        }

        if (jobResult.job_type != null) {
            optionalReq = `${optionalReq},"job_type"`;
            optionalValues = `${optionalValues},'${jobResult.engine_hours}'`
        }

        if (jobResult.dispatcher_first_name != null) {
            optionalReq = `${optionalReq},"dispatcher_first_name"`;
            optionalValues = `${optionalValues},'${jobResult.dispatcher_first_name}'`
        }

        if (jobResult.dispatcher_last_name != null) {
            optionalReq = `${optionalReq},"dispatcher_last_name"`;
            optionalValues = `${optionalValues},'${jobResult.dispatcher_last_name}'`
        }

        // If Tractor Driver will create a work Order then below given query will be executed.
        let query = `
            INSERT INTO 
                        "Job_Results" 
                        (job_status
                        ${optionalReq})
      
            VALUES      (
                        'verified'
                        ${optionalValues});
          `;

        console.log(query);

        db.connect();
        await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Job Result has been created successfully",
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
