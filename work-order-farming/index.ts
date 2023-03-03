import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addWorkOrder from "./post";
import * as getWorkOrder from "./get";
import * as updateWorkOrder from "./patch";
import * as getWorkOrderById from "./getById";
import * as updateInvoicedWorkOwrder from "./updateInvoicedWorkOrder";
import * as updatePaidWorkOrder from "./updatePaidWorkOrders";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.work_order_id) await getWorkOrderById.default(context, req);
            else await getWorkOrder.default(context, req);
            break;

        case "POST":
            await addWorkOrder.default(context, req);
            break;
        case "PATCH":
            if (req.body.operation === 'updateInvoicedWorkOrder')
                await updateInvoicedWorkOwrder.default(context, req);
            else if (req.body.operation === 'updatePaidWorkOrder')
                await updatePaidWorkOrder.default(context, req);
            else await updateWorkOrder.default(context, req);
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
