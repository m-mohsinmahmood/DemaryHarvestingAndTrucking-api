import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerFarmingRate from "./post";
import * as updateCustomerFarmingRate from "./put";
import * as getCustomerFarmingRate from "./get";
import * as getCustomerFarmingRateById from "./getById";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerFarmingRateById.default(context, req);
      else await getCustomerFarmingRate.default(context, req);
      break;

    case "POST":
      await addCustomerFarmingRate.default(context, req);
      break;

    case "PUT":
      await updateCustomerFarmingRate.default(context, req);
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
