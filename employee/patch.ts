import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { employee } from "./model";
import { updateQuery } from "./onboarding-status-bar";
const sgMail = require('@sendgrid/mail')



const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query;

  try {
    const employee: employee = req.body.employee_data;
    const email: any = req.body.email_data;

    query = updateQuery(employee, email);
    db.connect();
    let result = await db.query(query);
    db.end();

    //#region Send email to employee
    if (email && email.subject && email.to && email.body) {
      sgMail.setApiKey('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');
      const msg = {
        to: `${email.to}`,
        from: 'recruiter@dht-usa.com',
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
    //#endregion

    context.res = {
      status: 200,
      body: {
        message: "Employee has been updated successfully.",
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
