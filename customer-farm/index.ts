import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addFarm from "./post";
import * as updateFarm from "./put";
// import * as deleteComment from "./delete";
import * as getFarm from "./get";
import * as getFarmById from "./getById";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.id) await getFarmById.default(context, req);
        else await getFarm.default(context, req);
        break;

      case "POST":
        await addFarm.default(context, req);
        break;

      case "PUT":
        await updateFarm.default(context, req);
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
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        message: error,
      },
    };
  }
};

export default httpTrigger;
