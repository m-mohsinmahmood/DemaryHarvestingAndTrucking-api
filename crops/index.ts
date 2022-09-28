import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addCrop from "./post";
// import * as editComment from "./put";
// import * as deleteComment from "./delete";
import * as getCrops from "./get";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    
    case "GET":
      await getCrops.default(context, req);
      break;

    case "POST":
      await addCrop.default(context, req);
      break;

    case "PUT":
      // if (req.query.delete) await deleteComment.default(context, req);
      // else await editComment.default(context, req);
      break;

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
