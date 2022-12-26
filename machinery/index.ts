import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addMachinery from "./post";
import * as updateMachinery from "./put";
import * as getMachinery from "./get";
import * as getMachineryById from "./getById";
import * as deleteMachinery from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
    switch (req.method) {
    case "GET":
      if (req.query.id) await getMachineryById.default(context, req);
      else await getMachinery.default(context, req);
      break;

    case "POST":
      await addMachinery.default(context, req);
      break;

    case "PUT":
      await updateMachinery.default(context, req);
      break;

    case "DELETE":
      await deleteMachinery.default(context, req);
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
