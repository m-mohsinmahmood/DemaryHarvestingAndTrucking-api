import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { employee_docs } from "./model";
import { updateQuery } from "./employee-docs";
import { BlobServiceClient } from '@azure/storage-blob';
import { EmailClient, EmailMessage } from "@azure/communication-email";
import parseMultipartFormData from "@anzp/azure-function-multipart";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  //#region Variables
  const db = new Client(config);
  const db1 = new Client(config);
  const db2 = new Client(config);
  let result;
  let query;
  let doc;

  const multiPartConfig = {
    limits: { fields: 9, files: 1 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);

  let employee_doc: employee_docs = (JSON.parse(fields[0].value));
  let doc_status = fields[1].value;
  let employee_id = fields[2].value;
  let doc_name = fields[3].value;
  let status_bar_doc = fields[4].value;
  let email = fields[5].value;
  let subject = fields[6].value;
  let email_body = fields[7].value;
  let h2a = fields[8].value;
  //#endregion

  try {
    query = updateQuery(employee_doc, doc_status, employee_id, doc_name);
    db.connect();
    result = await db.query(query);
    db.end();
  }
  catch (error) {
    db.end();
    context.res = {
      status: 400,
      body: {
        message: error.message,
      },
    };
    context.done();
    return;
  }

  //#region Upload Employee Doc to blob and update employee in DB
  if (doc_status != 'Reject' && employee_doc[doc_name] != null && employee_doc[doc_name] != '') {
    try {
      const random_num = Math.random() * 1000;
      const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/employees?sp=rawd&st=2023-01-14T11:52:11Z&se=2024-12-31T19:52:11Z&spr=https&sv=2021-06-08&sr=c&sig=qsEWo%2F1vfQzmw9V8HdI%2FEfL1R4l3hho4wd49Czmq%2BC8%3D");
      const container = blob.getContainerClient("employees");
      doc = "doc" + Math.round(random_num) + employee_id;
      const blockBlob = container.getBlockBlobClient(doc);
      const uploadFileResp = await blockBlob.uploadData(files[0].bufferFile, {
        blobHTTPHeaders: { blobContentType: files[0].mimeType },
      });
    }
    catch (error) {
      context.res = {
        status: 400,
        body: {
          message: error,
        },
      };
      context.done();
      return;
    }

    try {
      let update_query = `
      UPDATE "Employee_Documents"
      SET 
      ${doc_name} = '${'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/' + doc}'
      WHERE 
      "employee_id" = '${employee_id}';`
      db1.connect();
      await db1.query(update_query);
      db1.end();
    } catch (error) {
      db1.end();
      context.res = {
        status: 400,
        body: {
          message: error,
        },
      };
      context.done();
      return;
    }
  }

  //#endregion

  //#region Send an email when document is rejected by admin or employee uploads details
  if (doc_status == 'Reject') {
    const connectionString = process.env["EMAIL_CONNECTION_STRING"];
    const client = new EmailClient(connectionString);
    const emailMessage: EmailMessage = {
      sender: "recruiter@dht-usa.com",
      content: {
        subject: `${subject}`,
        html: `${email_body}`
      },
      recipients: {
        to: [
          {
            email: `${email}`,
          },
        ],
      },
    };

    const messageId: any = await client.send(emailMessage);
  }
  else {
    const connectionString = process.env["EMAIL_CONNECTION_STRING"];
    const client = new EmailClient(connectionString);
    const emailMessage: EmailMessage = {
      sender: "recruiter@dht-usa.com",
      content: {
        subject: `${subject}`,
        html: `${email_body}`
      },
      recipients: {
        to: [
          {
            email: "recruiter@dht-usa.com",
          },
        ],
      },
    };

    const messageId: any = await client.send(emailMessage);

  }


  //#endregion


  //#region Update Status Bar
  if (status_bar_doc) {
    let update_status_bar_query;
    try {
      if (h2a == 'false') {
        update_status_bar_query = `
        UPDATE "Employee_Status_Bar"
        SET 
        `;
      }

      else if (h2a == 'true') {
        update_status_bar_query = `
        UPDATE "H2a_Status_Bar"
        SET 
        `;
      }

      doc_status == 'Reject' ?
        update_status_bar_query = update_status_bar_query + ` ${status_bar_doc} = 'Inprogress'` :
        update_status_bar_query = update_status_bar_query + ` ${status_bar_doc} = 'Document Uploaded'`;
      update_status_bar_query = update_status_bar_query + `
        WHERE "employee_id" = '${employee_id}';
        `;
      db2.connect();
      await db2.query(update_status_bar_query);
      db2.end();
    } catch (error) {
      db2.end();
      context.res = {
        status: 400,
        body: {
          message: error,
        },
      };
      context.done();
      return;
    }
  }
  //#endregion

  //#region Success 
  context.res = {
    status: 200,
    body: {
      message: "Employee doc has been updated successfully.",
    },
  };
  context.done();
  return;

  //#endregion

};

export default httpTrigger;
