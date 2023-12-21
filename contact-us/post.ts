import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { EmailClient, EmailMessage } from "@azure/communication-email";


const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {

    try {
        const data = req.body
        console.log("check this data", data)
        const connectionString = process.env["EMAIL_CONNECTION_STRING"];
        const client = new EmailClient(connectionString);

        const emailMessage: EmailMessage = {
            senderAddress: "recruiter@dht-usa.com",
            content: {
                subject: data?.inquiry_type,
                html:  `
               <b>Name : </b> ${data?.name}
               <br><br> <b>Email: </b> ${data?.email}
               <br><br> <b>Iquiry Type : </b> ${data?.inquiry_type}
               <br><br> <b>Message : </b> ${data?.message}
                `
            },
            recipients: {
                to: [
                    {
                        address: 'waqarhafeez@mailinator.com',
                    },
                ],
            },
        };

        await client.beginSend(emailMessage);
        context.res = {
            status: 200,
            body: {
                message: "Contact Us form has been submitted successfully.",
            },
        };
        context.done();
        return;
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
    
};
export default httpTrigger;
