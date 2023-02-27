import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as createDeliveryTicket from "./post";
import * as getDeliveryTicket from "./get";
import * as updateDeliveryTicket from "./patch";
import * as updateInvoicedDeliveryTicket from "./updatedInvoicedDeliveryTicket";
import * as updatePaidDeliveryTicket from "./updatedInvoicedDeliveryTicket";

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

        case "PATCH":
            if (req.body.operation === 'updateInvoicedDeliveryTicket')
                await updateInvoicedDeliveryTicket.default(context, req);
            else if (req.body.operation === 'updatePaidDeliveryTicket')
                await updatePaidDeliveryTicket.default(context, req);
            else await updateDeliveryTicket.default(context, req);
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
