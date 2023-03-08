import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerDestination from "./post";
import * as updateCustomerDestination from "./put";
import * as getCustomerDestination from "./get";
import * as getCustomerDestinationById from "./getById";
import * as deleteCustomerDestination from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerDestinationById.default(context, req);
      else await getCustomerDestination.default(context, req);
      break;

    case "POST":
      await addCustomerDestination.default(context, req);
      break;

    case "PUT":
      await updateCustomerDestination.default(context, req);
      break;
    
    case "DELETE":
      await deleteCustomerDestination.default(context, req);
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
