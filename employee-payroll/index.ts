import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as getEmployeeDwr from "./get";
import * as getByPeriod from "./getByPeriod";
import * as getDetailedPeriodSummary from "./getDetailedPeriod";



const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
    switch (req.method) {
                case "GET":
                    if (req.query.operation === 'PayrollPeriod') await getByPeriod.default(context, req);
                    else if (req.query.operation === 'PeriodDetailedSummary') await getDetailedPeriodSummary.default(context, req);
                    else await getEmployeeDwr.default(context, req);
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