import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getCustomFarmingJobs from "./getCustomFarming";
import * as getCommercialTruckingJobs from "./getCommercialTrucking";
import * as getCustomHarvestingJobs from "./getCustomHarvesting";
import * as createJobResult from "./post";
import * as editCustomerJob from "./editTruckingJob";
import * as editFarmingJob from "./editFarmingJob"

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            // if (req.query.id) await getWorkOrderById.default(context, req);
            if (req.query.customer_id && req.query.data == 'farming') await getCustomFarmingJobs.default(context, req);
            else
                if (req.query.customer_id && req.query.data == 'trucking') await getCommercialTruckingJobs.default(context, req);
                else
                    if (req.query.customer_id && req.query.data == 'harvesting') await getCustomHarvestingJobs.default(context, req);

            break;

        case "POST":
            await createJobResult.default(context, req);
            break;

        case "PATCH":
            if (req.body.operation === 'editTruckingJobResults') await editCustomerJob.default(context, req);
            else if (req.body.operation === 'editFarmingJobResults') await editFarmingJob.default(context, req);
            break;
        default:
            context.res = {
                status: 404,
                body: {
                    message: "Route not found.",
                },
            };
            break;
    }
};

export default httpTrigger;
