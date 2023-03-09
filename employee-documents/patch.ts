import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { employee_docs } from "./model";
import { updateQuery } from "./employee-docs";
import { updateActionRequired } from "./update-action-required";
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
  const db3 = new Client(config);
  const db4 = new Client(config);
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

  //#region Update Query

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

  //#endregion

  //#region Get Employee Documents to update Action Required
  try {
    let employee_info_query
    employee_info_query = `
        SELECT 
              e1.status_step,
              e2."id",	
              e2."employee_id",	
              e2."passport_disclaimer",	
              e2."approval_letter_disclaimer",	
              e2."contract_disclaimer",
              e2."b797_disclaimer",
              e2."dot_physical_disclaimer",
              e2."drug_test_disclaimer",
              e2."auto_license_disclaimer",
              e2."cdl_license_disclaimer",
              e2."work_agreement_disclaimer",
              e2."itinerary_disclaimer",
              e2."visa_disclaimer",
              e2."i9_disclaimer",
              e2."i94_disclaimer",
              e2."cert_disclaimer",
              e2."department_disclaimer",
              e2."handbook_disclaimer",
              e2."rules_disclaimer",
              e2."drug_policy_disclaimer",
              e2."reprimand_policy_disclaimer",
              e2."departure_disclaimer",
              e2."bank_acc_disclaimer",
              e2."social_sec_disclaimer",
              e2."w4_disclaimer" ,
              e2."cdl_training_disclaimer",
              e2."foreign_driver_license_disclaimer",
              e2."equipment_policy_disclaimer",
              e2."american_license_disclaimer",
              e2."visa_interview_disclaimer"
              `;

    employee_info_query = employee_info_query + `
        FROM 
             "Employees" e1
              FULL JOIN "Employee_Documents" e2
              ON e1."id" = e2."employee_id" 
        WHERE 
              e1."id" = '${employee_id}'
    `;

    db4.connect();

    let result = await db4.query(employee_info_query);
    let resp;
    resp = result.rows[0];
    if (result.rows.length > 0) {
      if (updateActionRequired(resp)){
          try {
            let updateActionRequiredQuery = 
            `UPDATE "Employees"
              SET
              "action_required" = '${true}'
              WHERE "id" = '${employee_id}'
              `;
            db3.connect();
            result = await db3.query(updateActionRequiredQuery);
            db3.end();
          }
          catch (error) {
            db3.end();
            context.res = {
              status: 400,
              body: {
                message: 'Error Updating Employee Action Required',
              },
            };
            context.done();
            return;
          }
      }
      // showIcons: resp.social_sec_disclaimer == true && resp.cdl_license_disclaimer == true
      // showIcons: resp.work_agreement_disclaimer == true && resp.itinerary_disclaimer == true && resp.rules_disclaimer == true && resp.handbook_disclaimer == true ? true : false,
      // showIcons: resp.contract_disclaimer == true && resp.w4_disclaimer == true ? true : false,
      // showIcons: resp.bank_acc_disclaimer == true ? true : false,
      // showIcons: resp.reprimand_policy_disclaimer == true && resp.drug_policy_disclaimer == true && resp.departure_disclaimer == true && resp.equipment_policy_disclaimer == true ? true : false,
      // showIcons: resp.cdl_training_disclaimer == true ? true : false,

    }
    else {
      resp = {
        message: "No employee exists with this id.",
      };
    }

    db4.end();
    context.res = {
      status: 200,
      body: {}
    };
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

  //#endregion

  //#region Upload Employee Doc to blob and update employee in DB
  if (doc_status != 'Reject' && employee_doc[doc_name] != null && employee_doc[doc_name] != '' && files[0]) {
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
      ${doc_name} = $$${'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/' + doc}$$
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
