import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { employee } from "./model";
import { updateQuery } from "./onboarding-status-bar";
import { EmailClient, EmailMessage } from "@azure/communication-email";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { BlobServiceClient } from "@azure/storage-blob";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const {fields, files} = await parseMultipartFormData(req);

    const data = JSON.parse(fields[0].value);
    const field = JSON.parse(fields[1].value);
    const id = fields[4].value;
    let doc = '';

    //#region Upload Employee Doc to blob and update employee in DB
  if (files.length > 0) {
    try {
      const random_num = Math.random() * 1000;
      const blobServiceUrl = process.env["BLOB_SERVICE_URL"];
      const blob = new BlobServiceClient(blobServiceUrl);
      const container = blob.getContainerClient("employees");
      doc = "doc" + Math.round(random_num) + id;
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
}
    //Update employee Status step
    try {
      let update_employee_info_query = `
      UPDATE
        "Employee_Documents"
      SET
      ${creatQuery(data,field,files,doc)}
      WHERE
        "employee_id" = '${id}';
      `;
      db.connect();
      await db.query(update_employee_info_query);
      db.end();
    }
    catch (error) {
      db.end();
      context.res = {
        status: 500,
        body: {
          message: error.message,
        },
      };
      return;
    }
  
    context.res = {
      status: 200,
      body: {
        message: "Onboarding info has been updated successfully.",
      },
    };
    context.done();
    return;
  }

   catch (error) {
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

const creatQuery = function(data, fields, files, doc){
    let query = '';
    fields.forEach(field => {
        if(files.length>0 && field.key.includes('_doc'))
            query += `"${field.key}" = 'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/${doc}',`
        else
            query += `"${field.key}" = '${data[field.key]}',`
    });
    query = query.substring(0,query.lastIndexOf(','));
    return query;
}

export default httpTrigger;
