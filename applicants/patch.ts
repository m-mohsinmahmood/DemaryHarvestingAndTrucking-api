import { applicant } from './model';
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
const sgMail = require('@sendgrid/mail')
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
    sgMail.setApiKey('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');
    const msg = {
      to: `${email.to}`, 
      from: 'momin4073@gmail.com',
      subject: `${email.subject}`,
      html: `${email.body}`
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
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
