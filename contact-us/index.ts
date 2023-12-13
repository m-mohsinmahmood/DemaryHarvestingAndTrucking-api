import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as sendEmailToUser from "./post";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "POST":
            await sendEmailToUser.default(context, req);
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
