import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as setupTruckDriver from "./setupTruckDriver";
import * as getTruckDrivers from "./getTruckDrivers";
import * as getKartOperatorTruckDrivers from "./getKartOperatorTruckDrivers";
import * as createDeliveryTicket from "./post"
import * as getCrewChief from "./getCrewChief";
import * as reAssignTruckDriver from "./reassignTruckDriver";
import * as updateTicketInfo from "./updateTicketInfo";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {

  switch (req.method) {
    case "GET":
      if (req.query.operation === 'kartOperatorTruckDrivers' && req.query.id)
        await getKartOperatorTruckDrivers.default(context, req);
      else if (req.query.operation === 'truckDriversDropDown')
        await getTruckDrivers.default(context, req);
      else if (req.query.operation === 'getKartOpCrewChief')
        await getCrewChief.default(context, req);
      break;

    case "PATCH":
      if (req.body.operation === 'addTruckDrivers')
        await setupTruckDriver.default(context, req);
        else if (req.body.operation === 'reAssignTruckDrivers')
        await reAssignTruckDriver.default(context, req);
        else if (req.body.operation === 'updateTicketInfo')
        await updateTicketInfo.default(context, req);
      break;

    case "POST":
      if (req.body.operation === 'createDeliveryTicket')
        await createDeliveryTicket.default(context, req);
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
