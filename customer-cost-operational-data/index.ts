import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addData from "./post";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        switch (req.method) {
            //   case "GET":
            //     if (req.query.id) await getCropById.default(context, req);
            //     else await getCrops.default(context, req);
            //     break;

            case "POST":
                await addData.default(context, req);
                break;

            //   case "PUT":
            //     await updateCrop.default(context, req);
            //     break;

            //   case "DELETE":
            //     await deleteCrop.default(context, req);
            //     break;

            default:
                context.res = {
                    status: 404,
                    body: {
                        message: "Route not found.",
                    },
                };
                break;
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: {
                message: error,
            },
        };
    }
};

export default httpTrigger;
