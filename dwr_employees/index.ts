import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addDWR from "./post";
import * as getDWR from "./get";
import * as updateDWR from "./patch";
import * as getDwrCount from "./getTicketsPerDwr";
import * as deleteData from "./delete";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.operation === 'getTicketsPerDwr') await getDwrCount.default(context, req);
            else await getDWR.default(context, req);
            break;

        case "POST":
            await addDWR.default(context, req);
            break;

        case "PATCH":
            await updateDWR.default(context, req);
            break;

        case "DELETE":
            await deleteData.default(context, req);
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
