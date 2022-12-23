import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addDwr from "./post";
import * as closeDwr from "./patch";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        // case "GET":
        //   if (req.query.id) await getEmployeesById.default(context, req);
        //   else await getEmployees.default(context, req);
        //   break;

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
