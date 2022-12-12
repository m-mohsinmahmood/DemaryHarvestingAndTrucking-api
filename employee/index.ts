import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getEmployees from "./get";
import * as getEmployeesById from "./getById";
import * as addEmployee from "./post";
import * as updateEmployee from "./put";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getEmployeesById.default(context, req);
      else await getEmployees.default(context, req);
      break;

    case "POST":
      await addEmployee.default(context, req);
      break;

    case "PUT":
      await updateEmployee.default(context, req);
      break;

    // case "PATCH":
    //   await patchApplicant.default(context, req);
    //   break;

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
