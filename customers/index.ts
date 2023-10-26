import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCustomer from "./post";
import * as updateCustomer from "./put";
import * as getCustomers from "./get";
import * as getCustomerById from "./getById";
import * as deleteCustomer from "./delete";
import * as getCustomersEmployeePortal from "./get-employee-portal"

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getCustomerById.default(context, req);
      else if (req.query.portal_type) await getCustomersEmployeePortal.default(context, req);
      else await getCustomers.default(context, req);
      break;

    case "POST":
      await addCustomer.default(context, req);
      break;

    case "PUT":
      await updateCustomer.default(context, req);
      break;

    case "DELETE":
      await deleteCustomer.default(context, req);
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
