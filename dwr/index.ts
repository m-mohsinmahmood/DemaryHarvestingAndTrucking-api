import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addDwr from "./post";
import * as closeDwr from "./patch";
import * as beginningOfDay from "./get";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            await beginningOfDay.default(context, req);
            break;

        case "POST":
            await addDwr.default(context, req);
            break;

        case "PATCH":
            await closeDwr.default(context, req);
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
