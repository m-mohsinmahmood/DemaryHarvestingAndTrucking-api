import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addData from "./post";
// import * as getData from "./get";
// import * as getDataById from "./getById";
// import * as editData from "./put";
// import * as deleteData from "./delete";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        switch (req.method) {
            // case "GET":
            //     if (req.query.id) await getDataById.default(context, req);
            //     else await getData.default(context, req);
            //     break;

            case "POST":
                await addData.default(context, req);
                break;

            // case "PUT":
            //     await editData.default(context, req);
            //     break;

            // case "DELETE":
            //     await deleteData.default(context, req);
            //     break;


            default:
                context.res = {
                    status: 404,
                    body: {
                        message: "Route not found.",
                    },
                };
                break;
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: {
                message: error,
            },
        };
    }
};

export default httpTrigger;
