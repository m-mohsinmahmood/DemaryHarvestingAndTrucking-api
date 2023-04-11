import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addData from "./post";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        // case "GET":
        //     if (req.query.id) await getDWRById.default(context, req);
        //     break;

        case "POST":
            await addData.default(context, req);
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
