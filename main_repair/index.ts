import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as post from "./post";
import * as getById from "./getById";
import * as patch from "./patch";
import * as getListing from "./getListing"
import * as getByIdMainRepairTicket from "./getByIdMainRepairTicket"

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
         case "GET":
            if(req.query.entity === 'getEmployeeById' || req.query.entity === 'unassignedTickets' || req.query.entity === "repair" || req.query.entity === "maintenance" || req.query.entity === 'assignedTicketRecord' || req.query.entity === 'unassignedTicketRecord' || req.query.entity === 'unassignedTickets' || req.query.entity === "repair" || req.query.entity === "maintenance" || req.query.entity === 'assignedTicketRecord' || req.query.entity === 'continuedTickets' || req.query.entity === 'continuedTicket' || req.query.entity === 'completedTicket' || req.query.entity === 'all')
       await getById.default(context, req);
       else if (req.query.operation === 'MaintenanceRepairList') await getListing.default(context, req);
       else if (req.query.operation === 'ticketById') await getByIdMainRepairTicket.default(context, req);

      break;

        case "POST":
            await post.default(context, req);
            break;

            case "PATCH":
            await patch.default(context, req);
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
