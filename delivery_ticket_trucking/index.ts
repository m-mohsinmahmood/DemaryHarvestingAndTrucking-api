import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as createDeliveryTicket from "./post";
import * as getDeliveryTicket from "./get";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            await getDeliveryTicket.default(context, req);
            break;

        case "POST":
            await createDeliveryTicket.default(context, req);
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
