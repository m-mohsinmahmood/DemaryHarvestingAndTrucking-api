import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as postData from "./post";
// import * as closeDwr from "./patch";
// import * as beginningOfDay from "./get";
import * as getTraineeId from "./getById";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
         case "GET":
        if (req.query.trainee_id || req.query.trainer_id) await getTraineeId.default(context, req);
      break;

        case "POST":
            await postData.default(context, req);
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
