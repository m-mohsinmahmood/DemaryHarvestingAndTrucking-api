import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as createTicket from "./post";
import * as getJob from "./get";
import * as getTicketById from "./getById";
import * as getSent from "./getSent";
import * as getPending from "./getPending";
import * as getVerified from "./getVerified";
import * as updateTicket from "./patch";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    switch (req.method) {    
      case "GET":

        if (req.query.id) await getTicketById.default(context, req);
        else if (req.query.status === 'sent') await getSent.default(context, req);
        else if (req.query.status === 'pending') await getPending.default(context, req);
        else if (req.query.status === 'verified') await getVerified.default(context, req);
        else await getJob.default(context, req);
          break;

        case "POST":
          await createTicket.default(context, req);
          break;
      
      case "PATCH":
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