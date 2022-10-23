import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerHaulingRate from "./post";
import * as updateCustomerHaulingRate from "./put";
import * as getCustomerHaulingRate from "./get";
import * as getCustomerHaulingRateById from "./getById";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerHaulingRateById.default(context, req);
      else await getCustomerHaulingRate.default(context, req);
      break;

    case "POST":
      await addCustomerHaulingRate.default(context, req);
      break;

    case "PUT":
      await updateCustomerHaulingRate.default(context, req);
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
