import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomerContact from "./post";
// import * as updateCustomer from "./put";
import * as getCustomerContacts from "./get";
import * as getCustomerContactById from "./getById";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerContactById.default(context, req);
      else await getCustomerContacts.default(context, req);
      break;

    case "POST":
      await addCustomerContact.default(context, req);
      break;

    case "PUT":
      // await updateCustomer.default(context, req);
      // break;

    case "DELETE":
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
