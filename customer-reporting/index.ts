import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getHarvestingHaulingRevenue from "./getHarvestingHaulingRevenue";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.operation === 'getHarvestingHaulingRevenue')
                await getHarvestingHaulingRevenue.default(context, req);
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
