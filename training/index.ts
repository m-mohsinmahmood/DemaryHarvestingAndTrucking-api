import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as postData from "./post";
import * as getTraineeId from "./getById";
import * as getData from "./get";
import * as patchData from "./patch";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
         case "GET":
        if (req.query.trainee_id || req.query.trainer_id || req.query.evaluation_type || req.query.record_id) await getTraineeId.default(context, req);
        else await getData.default(context, req)
      break;

        case "POST":
            await postData.default(context, req);
            break;

            case "PATCH":
            await patchData.default(context, req);
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
