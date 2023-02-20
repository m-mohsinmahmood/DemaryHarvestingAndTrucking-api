import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as createFarmingInvoice from "./createFarmingInvoice";
import * as createTruckingInvoice from "./createTruckingInvoice";
import * as createHarvestingInvoice from "./createHarvestingInvoice";
import * as getallCustomerJobResults from "./getCustomerJobResult";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    switch (req.method) {

        case "POST":
            if (req.body.operation === 'farmingInvoice') await createFarmingInvoice.default(context, req);
            else if (req.body.operation === 'truckingInvoice') await createTruckingInvoice.default(context, req);
            else if (req.body.operation === 'harvestingInvoice') await createHarvestingInvoice.default(context, req);

            break;

        case "GET":
            if (req.query.operation === 'allCustomerJobResult') await getallCustomerJobResults.default(context, req);

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