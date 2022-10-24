import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerCombiningRate from "./post";
import * as updateCustomerCombiningRate from "./put";
import * as getCustomerCombiningRate from "./get";
import * as getCustomerCombiningRateById from "./getById";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerCombiningRateById.default(context, req);
      else await getCustomerCombiningRate.default(context, req);
      break;

    case "POST":
      await addCustomerCombiningRate.default(context, req);
      break;

    case "PUT":
      await updateCustomerCombiningRate.default(context, req);
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
