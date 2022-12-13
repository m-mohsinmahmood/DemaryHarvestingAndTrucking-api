import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addMotorized from "./post";
import * as updateMotorized from "./put";
import * as getMotorized from "./get";
import * as getMotorizedById from "./getById";
import * as deleteMotorized from "./delete";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
      switch (req.method) {
      case "GET":
        if (req.query.id) await getMotorizedById.default(context, req);
        else await getMotorized.default(context, req);
        break;
  
      case "POST":
        await addMotorized.default(context, req);
        break;
  
      case "PUT":
        await updateMotorized.default(context, req);
        break;
  
      case "DELETE":
        await deleteMotorized.default(context, req);
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