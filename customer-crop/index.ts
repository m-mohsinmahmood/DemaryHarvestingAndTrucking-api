import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getCustomerCrop from "./get";
import * as getCustomerCropById from "./getById";
import * as addCustomerCrop from "./post";
import * as updateCustomerCrop from "./put";
import * as deleteCustomerCrop from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerCropById.default(context, req);
      else await getCustomerCrop.default(context, req);
      break;

    case "POST":
      await addCustomerCrop.default(context, req);
      break;

    case "PUT":
      await updateCustomerCrop.default(context, req);
      break;

    case "DELETE":
      await deleteCustomerCrop.default(context, req);
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
