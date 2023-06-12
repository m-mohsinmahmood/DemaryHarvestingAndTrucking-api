import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import * as createTicket from "./post";
import * as getJob from "./get";
import * as getTicketById from "./getById";
import * as updateTicket from "./patch";
<<<<<<< Updated upstream
import * as deleteTicket from "./delete";

=======
import * as getMaxDeliveryTicket from "./getMaxDeliveryTicket";
>>>>>>> Stashed changes

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  switch (req.method) {
    case "GET":

      if (req.query.id) await getTicketById.default(context, req);
      else if (req.query.operation === 'getMaxDeliveryTicket') await getMaxDeliveryTicket.default(context, req);

      else await getJob.default(context, req);
      break;

    case "PATCH":
      if(req.body.operation === 'deleteSentTicket')
      await deleteTicket.default(context, req);
      else
      await updateTicket.default(context, req);

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