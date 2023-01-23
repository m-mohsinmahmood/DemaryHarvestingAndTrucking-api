import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as setupTruckDriver from "./setupTruckDriver";
import * as getTruckDrivers from "./getTruckDrivers";
import * as getKartOperatorTruckDrivers from "./getKartOperatorTruckDrivers";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
  
    case "GET":
      if(req.query.id)
        await getKartOperatorTruckDrivers.default(context, req);  
      else
        await getTruckDrivers.default(context, req);
      break;

    case "PATCH":
      await setupTruckDriver.default(context, req);
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
