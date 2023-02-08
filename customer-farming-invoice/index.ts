import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getFarmingList from './getFarmingList';
import * as addFarmingInvoice from './postFarming';
import * as updateFarming from './putFarming';


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            // if (req.query.id) await getWorkOrderById.default(context, req);
            
            await getFarmingList.default(context, req);

            break;


        case "POST":
            await addFarmingInvoice.default(context, req);
            break;

        case "PUT":
            await updateFarming.default(context, req);
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
