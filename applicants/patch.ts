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
  const db1 = new Client(config);
  const db2 = new Client(config);
  let employee_id;

  try {
    const applicant: any = req.body.applicant_data;
    const applicant_info: any = req.body?.applicantInfo;
    const email: any = req.body.email_data;
    const type = req.query.type;
    const skip_email = req.body.skipEmail

    let query = updateQuery(applicant, email, type, applicant_info);

    db.connect();
    let result = await db.query(query);
    db.end();

    //#region create employee in employee status bar and employee documents if applicant accepts offer
    if (applicant.status_message == 'Results' && applicant.status_step == '10.1') {
      employee_id = result[1].rows[0].employee_id
      try {
        let employee_status_bar_query = `
        INSERT INTO 
                    "Employee_Status_Bar"
                    (
                      "employee_id",
                      "status_step",
                      "status_message",
                      "step_one_date",	
                      "created_at"
                    )
        VALUES
                    (
                      '${employee_id}',
                      '2',
                      'Account Activated',
                      now(),
                      now()
                    )
        `;
        db1.connect();
        let result2 = await db1.query(employee_status_bar_query);
        db1.end()
      } catch (error) {
        db1.end();
        context.res = {
          status: 400,
          body: {
            message: error.message,
          },
        };
        context.done();
        return;
      }
      //Employee Documents 
      try {
        let employee_document_query = `
        INSERT INTO 
                    "Employee_Documents"
                    (
                      "employee_id",	
                      "created_at"
                    )
        VALUES
                    (
                      '${employee_id}',
                      now()
                    )
        `;
        db2.connect();
        let result2 = await db2.query(employee_document_query);
        db2.end()
      } catch (error) {
        db2.end();
        context.res = {
          status: 400,
          body: {
            message: error.message,
          },
        };
        context.done();
        return;
      }
    }
    //#endregion
    if (email && email.subject && email.to && email.body && !skip_email) {
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



