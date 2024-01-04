import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getJobSummaryReport from "./get";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        switch (req.method) {
            case "GET":
                if (req.query.operation == 'getJobSummaryReport')
                    await getJobSummaryReport.default(context, req);

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
