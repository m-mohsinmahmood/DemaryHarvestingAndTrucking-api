import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { EmailClient, EmailMessage } from "@azure/communication-email";
import * as nodeCrypto from "crypto";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const email: string = req.body.email;
        let otp = '';
        try {
            otp = nodeCrypto.randomInt(100000, 999999).toString(); // 6 digit OTP
            // Sending OTP in email
            const connectionString = process.env["EMAIL_CONNECTION_STRING"];
            const client = new EmailClient(connectionString);

            const emailMessage: EmailMessage = {
                senderAddress: "recruiter@dht-usa.com",
                content: {
                    subject: "DHT Applicant OTP",
                    html: `
                         Dear applicant,
                         <br> <br>Thank you for using DHT’s online application process. Please find given OTP in this email and put it in application form to proceed.   
                         <br>
                         <p><strong>${otp}</strong></p>
                         <br>
                         Thank you
                         `
                },
                recipients: {
                    to: [
                        {
                            address: `${email}`,
                            displayName: ``
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

        let query = `
        UPDATE 
        "Applicants"
   
        SET 
        "generated_otp"     = '${otp}'
        
        WHERE 
        "email" = '${email}' ;`;

        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "OTP has been sent",
                status: 200
            },
        };
        context.done();

        return;
    } catch (err) {
        db.end();
        context.res = {
            status: 500,
            body: err,
        };
        context.done();
        return;
    }
};

export default httpTrigger;
