import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addPolicyDoc from "./post";
import * as getPolicyDocs from "./get";
import * as patchPolicyDocs from "./patch";
import * as deletePolicyDocs from "./delete";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      await getPolicyDocs.default(context, req);
      break;

    case "POST":
      await addPolicyDoc.default(context, req);
      break;

    case "PATCH":
      await patchPolicyDocs.default(context, req);
      break;

    case "DELETE":
      await deletePolicyDocs.default(context, req);
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
