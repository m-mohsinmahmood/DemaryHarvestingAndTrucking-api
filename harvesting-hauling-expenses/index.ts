import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getExpenses from "./get";
import * as getExpensesByCategory from "./getExpensesByCategory";
import * as getGrossMarginAnalysis from "./getGrossMarginAnalysis";
import * as getOperationalJobMetrics from "./getOperationalJobMetrics";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        switch (req.method) {
            case "GET":
                if (req.query.operation == 'getExpensesByCategory')
                    await getExpensesByCategory.default(context, req);
                else if (req.query.operation == 'getHarvestingGrossMargin' || req.query.operation == 'getHaulingGrossMargin' || req.query.operation == 'getByTotalJobs' || req.query.operation == 'totalAcrossJobs')
                    await getGrossMarginAnalysis.default(context, req);
                else if (req.query.operation == 'getOperationalJobMetrics')
                    await getOperationalJobMetrics.default(context, req);
                else
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
