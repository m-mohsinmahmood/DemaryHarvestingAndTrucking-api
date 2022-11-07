import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerTruckingRate from "./post";
import * as updateCustomerTruckingRate from "./put";
import * as getCustomerTruckingRate from "./get";
import * as getCustomerTruckingRateById from "./getById";
import * as deleteCustomerTruckingRate from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerTruckingRateById.default(context, req);
      else await getCustomerTruckingRate.default(context, req);
      break;

    case "POST":
      await addCustomerTruckingRate.default(context, req);
      break;

    case "PUT":
      await updateCustomerTruckingRate.default(context, req);
      break;

    case "DELETE":
      await deleteCustomerTruckingRate.default(context, req);
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
