import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerField from "./post";
import * as updateCustomerField from "./put";
import * as getCustomerField from "./get";
import * as getCustomerFieldById from "./getById";
import * as deleteCustomerField from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerFieldById.default(context, req);
      else await getCustomerField.default(context, req);
      break;

    case "POST":
      await addCustomerField.default(context, req);
      break;

    case "PUT":
      await updateCustomerField.default(context, req);
      break;

    case "DELETE":
      await deleteCustomerField.default(context, req);
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
