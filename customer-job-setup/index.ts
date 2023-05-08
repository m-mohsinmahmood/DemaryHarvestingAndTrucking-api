import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as createJob from "./post";
import * as getCreateJob from "./get";
import * as updateJob from "./patch";
import * as updatePreTripCheck from "./updatePreTripStatus";
import * as getEmployeeById from "./getById";
import * as getAssignedRoles from "./getAssignedRoles";
import * as updateCustomerJob from "./updateCustomerJob";
import * as beginningofDay from "./beginningOfDay";
import * as endingofDay from "./endingOfDay";
import * as removeRole from "./removeAssignedRoles";
import * as getInvoicedJobs from "./getInvoicedJobs";
import * as getCombineCartOperator from "./getCombineCartOperator";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  switch (req.method) {
    case "GET":
      if (req.query.job_id) await getEmployeeById.default(context, req);
      else if (req.query.operation === 'getInvoicedJobs') await getInvoicedJobs.default(context, req);
      else if (req.query.operation === 'getCombineCartOperator') await getCombineCartOperator.default(context, req);
      else if (req.query.combine_operator_id || req.query.cart_operator_id) await getAssignedRoles.default(context, req);
      else await getCreateJob.default(context, req);
      break;

    case "POST":
      await createJob.default(context, req);
      break;

    case "PUT":
      await createJob.default(context, req);
      break;

    case "PATCH":
      if (req.query.id)
        await updatePreTripCheck.default(context, req);
      else if (req.body.operation === 'beginningOfDay')
        await beginningofDay.default(context, req);
      else if (req.body.operation === 'endingOfDay')
        await endingofDay.default(context, req);
      else if (req.query.operation === 'updateCustomerJob')
        await updateCustomerJob.default(context, req);
      else if (req.body.operation === 'removeAssignedRole')
        await removeRole.default(context, req);
      else
        await updateJob.default(context, req);
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