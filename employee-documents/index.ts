import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addEmployeeDoc from "./post";
import * as updateEmployeeDoc from "./put";
import * as getEmployeeDocs from "./get";
import * as patchEmployeeDoc from "./patch";



const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      await getEmployeeDocs.default(context, req);
      break;

    case "POST":
      await addEmployeeDoc.default(context, req);
      break;

    case "PUT":
      await updateEmployeeDoc.default(context, req);
      break;
    
    case "PATCH":
      await patchEmployeeDoc.default(context, req);
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
