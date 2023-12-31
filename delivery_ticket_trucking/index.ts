import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as createDeliveryTicket from "./post";
import * as getDeliveryTicket from "./get";
import * as getById from "./getById";
import * as updateDeliveryTicket from "./patch";
import * as updateInvoicedDeliveryTicket from "./updatedInvoicedDeliveryTicket";
import * as updatePaidDeliveryTicket from "./updatePaidDeliveryTickets";
import * as getMaxDeliveryTicket from "./getMaxDeliveryTicket";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.id)
                await getById.default(context, req);
            else if (req.query.operation == 'getMaxDeliveryTicket')
                await getMaxDeliveryTicket.default(context, req);
            else
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
