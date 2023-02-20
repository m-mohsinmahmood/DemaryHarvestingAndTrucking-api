import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as addTruckingInvoice from './postTrucking';
import * as getTruckingList from './getTruckingList';
import * as updateTrucking from './putTrucking';


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            // if (req.query.id) await getWorkOrderById.default(context, req);
            await getTruckingList.default(context, req);
            break;


        case "POST":
            await addTruckingInvoice.default(context, req);
            break;

        case "PUT":
            await updateTrucking.default(context, req);
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
