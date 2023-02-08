import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getFarmingInvoices from './getFarmingInvoice';
import * as getTruckingInvoices from './getTruckingInvoice';
import * as getHarvestingInvoices from './getHarvestingInvoices';
import * as addHarvestingInvoice from './postHarvesting';
import * as getHarvestingList from './getHarvestingList';
import * as updateHarvesting from './putHarvesting';


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            // if (req.query.id) await getWorkOrderById.default(context, req);
            await getHarvestingList.default(context, req);
            break;


        case "POST":
            await addHarvestingInvoice.default(context, req);
            break;

        case "PUT":
            await updateHarvesting.default(context, req);
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
