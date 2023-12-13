import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { EmailClient, EmailMessage } from "@azure/communication-email";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {

    try {
        const connectionString = process.env["EMAIL_CONNECTION_STRING"];
        const client = new EmailClient(connectionString);

        const emailMessage: EmailMessage = {
            senderAddress: "recruiter@dht-usa.com",
            content: {
                subject: "DHT Employment Application Received!",
                html: `
                 Dear,
                 <br> <br>Thank you for completing DHT’s online application. We are currently reviewing your application and will be reaching out soon with further instructions on next steps. 
                 <br> <br>Thanks
                 `
            },
            recipients: {
                to: [
                    {
                        address: ``,
                        displayName: ``,
                    },
                ],
            },
        };

        await client.beginSend(emailMessage);
    }
    catch (error) {
        context.res = {
            status: 400,
            body: {
                message: "An error occured while sending email",
            },
        };
        context.done();
        return;
    }
    context.res = {
        status: 200,
        body: {
            message: "Contact Us form has been submitted successfully.",
        },
    };
    context.done();
    return;
};
export default httpTrigger;
