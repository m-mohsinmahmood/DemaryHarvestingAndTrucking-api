import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as getH2aRates from "./get";
import * as getH2aRateById from "./getById";
import * as updateH2aRate from "./put";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
    try {
      switch (req.method) {
        case "GET":
          if (req.query.id) await getH2aRateById.default(context, req);
          else await getH2aRates.default(context, req);
          break;
  
        case "PUT":
          await updateH2aRate.default(context, req);
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