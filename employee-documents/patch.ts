import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { employee_docs } from "./model";
import { updateQuery } from "./employee-docs";
import { BlobServiceClient } from '@azure/storage-blob';
import parseMultipartFormData from "@anzp/azure-function-multipart";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  //#region Variables
  const statusBarDocs: any[] = ['cdl_license_doc', 'social_sec_doc', 'work_agreement_doc', 'itinerary_doc', 'rules_doc', 'handbook_doc', 'contract_doc', 'w4_doc', 'bank_acc_doc', 'drug_policy_doc', 'reprimand_policy_doc', 'departure_doc'];
  const db = new Client(config);
  const db1 = new Client(config);
  const db2 = new Client(config);
  let result;
  let query;
  let doc;

  const multiPartConfig = {
    limits: { fields: 4, files: 1 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);

  let employee_doc: employee_docs = (JSON.parse(fields[0].value));
  let docName = fields[1].value;
  let employee_id = fields[2].value;
  let status_bar_doc = fields[3].value;
  //#endregion

  try {
    query = updateQuery(employee_doc, employee_id, docName);
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

  //#region Upload Employee Doc
  try {
    const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/employees?sp=rawd&st=2023-01-14T11:52:11Z&se=2024-12-31T19:52:11Z&spr=https&sv=2021-06-08&sr=c&sig=qsEWo%2F1vfQzmw9V8HdI%2FEfL1R4l3hho4wd49Czmq%2BC8%3D");
    const container = blob.getContainerClient("employees");
    doc = "doc" + employee_id;
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
  //#endregion
  //#region Update Employee
  try {
    let update_query = `
    UPDATE "Employee_Documents"
    SET 
    ${docName} = '${'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/' + doc}'
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
  //#endregion

  //#region Update Status Bar 
  if (status_bar_doc) {
    try {
      let update_status_bar_query = `
      UPDATE "Employee_Status_Bar"
      SET 
      ${status_bar_doc} = 'Document Uploaded'
      WHERE 
      "employee_id" = '${employee_id}';`
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
