import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getExpenses from "./get";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        switch (req.method) {
            case "GET":
                await getExpenses.default(context, req);
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
