import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getEmployees from "./get";
import * as getEmployeesById from "./getById";
import * as addEmployee from "./post";
import * as updateEmployee from "./put";
import * as patchEmployee from "./patch";
import * as deleteEmployee from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id || req.query.fb_id) await getEmployeesById.default(context, req);
      else await getEmployees.default(context, req);
      break;

    case "POST":
      await addEmployee.default(context, req);
      break;

    case "PUT":
      await updateEmployee.default(context, req);
      break;

    case "PATCH":
      await patchEmployee.default(context, req);
      break;
    
    case "DELETE":
    await deleteEmployee.default(context, req);
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
