import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addNonMotorized from "./post";
import * as updateNonMotorized from "./put";
import * as getNonMotorized from "./get";
import * as getNonMotorizedById from "./getById";
import * as deleteNonMotorized from "./delete";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
      switch (req.method) {
      case "GET":
        if (req.query.id) await getNonMotorizedById.default(context, req);
        else await getNonMotorized.default(context, req);
        break;
  
      case "POST":
        await addNonMotorized.default(context, req);
        break;
  
      case "PUT":
        await updateNonMotorized.default(context, req);
        break;
  
      case "DELETE":
        await deleteNonMotorized.default(context, req);
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