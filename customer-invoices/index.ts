import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as getallCustomerJobResults from "./getCustomerJobResult";
import * as getTruckingCustomerJobResults from "./getTruckingCustomerJobResult";
import * as getFarmingInvoices from "./getFarmingInvoices";
import * as getTruckingInvoice from "./getTruckingInvoices";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    switch (req.method) {
        case "GET":
            if (req.query.operation === 'allCustomerJobResult') await getallCustomerJobResults.default(context, req);
            else if (req.query.operation === 'allTruckingCustomerJobResult') await getTruckingCustomerJobResults.default(context, req);
            else if (req.query.operation === 'getFarmingInvoices') await getFarmingInvoices.default(context, req);
            else if (req.query.operation === 'getTruckingInvoices') await getTruckingInvoice.default(context, req);

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