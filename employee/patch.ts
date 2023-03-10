import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { employee } from "./model";
import { updateQuery } from "./onboarding-status-bar";
import { EmailClient, EmailMessage } from "@azure/communication-email";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  let query;

  try {
    const employee: employee = req.body.employee_data;
    const email: any = req.body.email_data;
    const h2a: string = req.body.h2a;

    query = updateQuery(employee, h2a);
    db.connect();
    let result = await db.query(query);
    db.end();

    //Update employee Status step
    try {
      let update_employee_query = `
      UPDATE
        "Employees"
      SET
        "status_step" = '${employee.status_step}'
      WHERE
        "id" = '${employee.id}';
      `
      db1.connect();
      await db1.query(update_employee_query);
      db1.end();
    }
    catch (error) {
      db1.end();
      context.res = {
        status: 500,
        body: {
          message: error.message,
        },
      };
      return;
    }
    //#region Send email to employee
    if (email && email.subject && email.to && email.body) {
      const connectionString = process.env["EMAIL_CONNECTION_STRING"];
      const client = new EmailClient(connectionString);
      const emailMessage: EmailMessage = {
        senderAddress: "recruiter@dht-usa.com",
        content: {
          subject: `${email.subject}`,
          html: `${email.body}`
        },
        recipients: {
          to: [
            {
              address: `${email.to}`,
            },
          ],
        },
      };

      const messageId: any = await client.beginSend(emailMessage);
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
