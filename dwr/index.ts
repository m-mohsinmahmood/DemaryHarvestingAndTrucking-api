import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addDwr from "./post";
import * as closeDwr from "./patch";
import * as beginningOfDay from "./get";
import * as getDWRById from "./getById";
import * as getEmployeeDwr from "./getEmployeeDwr";
import * as changeDwrStatus from "./changeDwrStatus";
import * as verifyDWR from "./verifyDWR";
import * as reassignDWR from "./reassignDWR";
import * as editDWR from "./editDWR";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.id) await getDWRById.default(context, req);
            else if (req.query.operation === 'getDWRList' || req.query.operation === 'getDWRDetails' || req.query.operation === 'getDWRToVerify')
                await getEmployeeDwr.default(context, req);
            else await beginningOfDay.default(context, req);
            break;

        case "POST":
            await addDwr.default(context, req);
            break;

        case "PATCH":
            if (req.query.operation === 'changeDwrStatus') await changeDwrStatus.default(context, req);
            else if (req.query.operation === 'verifyDwr') await verifyDWR.default(context, req);
            else if (req.query.operation === 'reassignDwr') await reassignDWR.default(context, req);
            else if (req.query.operation === 'editDwr') await editDWR.default(context, req);

            else
                await closeDwr.default(context, req);
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
