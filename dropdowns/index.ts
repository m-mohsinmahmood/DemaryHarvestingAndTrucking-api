import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getAllCrops from "./getAllCrops";
import * as getCustomerCrops from "./getCustomerCrops";
import * as getCustomerFarms from "./getCustomerFarms";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.entity === "allCrops")
          await getAllCrops.default(context, req);
        else if (req.query.entity === "customerCrops")
          await getCustomerCrops.default(context, req);
        else if (req.query.entity === "customerFarms")
          await getCustomerFarms.default(context, req);
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
