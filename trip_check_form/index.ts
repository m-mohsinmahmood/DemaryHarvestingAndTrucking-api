import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as createPreCheckForm from "./post";
import * as getActiveTicket from "./getTicket";
import * as getTicketsList from "./get";
import * as getById from "./getById";
import * as getTicketStatus from "./getTicketStatus";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.clause === 'getActiveTicket') await getActiveTicket.default(context, req);
            else if (req.query.clause === 'getTicketById') await getById.default(context, req);
            else if (req.query.clause === 'getTicketStatus') await getTicketStatus.default(context, req);
            else await getTicketsList.default(context, req);
            break;

        case "POST":
            await createPreCheckForm.default(context, req);
            break;

        case "PATCH":
            await createPreCheckForm.default(context, req);
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
