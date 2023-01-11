import { applicant } from './model';
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { EmailClient, EmailMessage } from "@azure/communication-email";
import { config } from "../services/database/database.config";
import { updateQuery } from "./applicant-review";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try { 
    const applicant: any = req.body.applicant_data;
    const applicant_info: any = req.body?.applicantInfo;
    const email: any = req.body.email_data;
    const type = req.query.type;
    const skip_email = req.body.skipEmail

    let query = updateQuery(applicant, email, type,applicant_info);

    db.connect();
    let result = await db.query(query);
    db.end();

    if(email && email.subject && email.to && email.body && !skip_email){
    let emailBody = email.body.replace('&#8205','');
    
    const connectionString = process.env["EMAIL_CONNECTION_STRING"];
    const client = new EmailClient(connectionString);
    
    const emailMessage: EmailMessage = {
      sender: "recruiter@dht-usa.com",
      content: {
        subject: `${email.subject}`,
        html: `${emailBody}`
      },
      recipients: {
        to: [
          {
            email: `${email.to}`,
          },
        ],
      },
    };
    
    const messageId:any = await client.send(emailMessage);
    console.log(messageId);
    }

    context.res = {
      status: 200,
      body: {
        message: "Applicant has been updated successfully.",
      },
    };
    context.done();
    return;
  } catch (error) {
    db.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    return;
  }
};

export default httpTrigger;
