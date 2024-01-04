import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addApplicant from "./post";
import * as getApplicants from "./get";
import * as getApplicantById from "./getById";
import * as updateApplicant from "./put";
import * as patchApplicant from "./patch";
import * as deleteApplicant from "./delete";
import * as getApplicantByEmail from "./getByEmail";
import * as sendOTP from "./sendOTP";
import * as verifyOTP from "./verifyOTP";
import * as rehireExEmployee from "./rehireExEmployee";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.id) await getApplicantById.default(context, req);
      else if (req.query.operation == 'verifyOTP' && req.query.email) await verifyOTP.default(context, req);
      else if (req.query.email) await getApplicantByEmail.default(context, req);
      else await getApplicants.default(context, req);
      break;

    case "POST":
      await addApplicant.default(context, req);
      break;

    case "PUT":
      await updateApplicant.default(context, req);
      break;

    case "PATCH":
      if (req.body.operation == 'sendOTP')
        await sendOTP.default(context, req);
      else if (req.body.operation == 'rehire')
        await rehireExEmployee.default(context, req);
      else
        await patchApplicant.default(context, req);
      break;

    case "DELETE":
      await deleteApplicant.default(context, req);
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
