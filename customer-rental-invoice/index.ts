import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getRentalList from './getRentalList';
import * as addRentalInvoice from './postRental';
import * as updateRental from './putRental';


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    switch (req.method) {
        case "GET":
            // if (req.query.id) await getWorkOrderById.default(context, req);
            
            await getRentalList.default(context, req);

            break;


        case "POST":
            await addRentalInvoice.default(context, req);
            break;

        case "PUT":
            await updateRental.default(context, req);
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
