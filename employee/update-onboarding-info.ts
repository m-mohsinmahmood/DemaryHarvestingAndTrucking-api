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
  const db1 = new Client(config);
  const db2 = new Client(config);

  try {
    const { fields, files } = await parseMultipartFormData(req);

    const data = JSON.parse(fields[0].value);
    const field = JSON.parse(fields[1].value);
    const id = fields[4].value;
    let doc = "";

    //#region Upload Employee Doc to blob and update employee in DB
    if (files.length > 0) {
      try {
        const random_num = Math.random() * 1000;
        const blobServiceUrl = process.env["BLOB_SERVICE_URL"];
        const blob = new BlobServiceClient(blobServiceUrl);
        const container = blob.getContainerClient("employees");
        let docUrl = "";
        const docKey = getDocKey(field);
        if (docKey) {
          const query = `SELECT ${docKey} from "Employee_Documents" where employee_id = '${id}'`;
          db1.connect();
          const result = await db1.query(query);
          docUrl = result.rows[0][docKey];
          db1.end();
        }
        doc = "doc" + Math.round(random_num) + id;
        const deleteBlockBlob = container.getBlockBlobClient(
          docUrl.substring(docUrl.lastIndexOf("/") + 1)
        );
        const isDeleted = await deleteBlockBlob.deleteIfExists();
        const blockBlob = container.getBlockBlobClient(doc);
        const uploadFileResp = await blockBlob.uploadData(files[0].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[0].mimeType },
        });
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
    //Update employee Status step
    try {
      let update_employee_info_query = `
      UPDATE
        "Employee_Documents"
      SET
      ${creatQuery(data, field, files, doc)}
      WHERE
        "employee_id" = '${id}';
      `;
      db2.connect();
      await db2.query(update_employee_info_query);
      db2.end();
    } catch (error) {
      db2.end();
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
  } catch (error) {
    db2.end();
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    return;
  }
};

const creatQuery = function (data, fields, files, doc) {
  let query = "";
  fields.forEach((field) => {
    if (files.length > 0 && field.key.includes("_doc"))
      query += `"${field.key}" = 'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/${doc}',`;
    else query += `"${field.key}" = '${data[field.key]}',`;
  });
  query = query.substring(0, query.lastIndexOf(","));
  return query;
};

const getDocKey = function (fields) {
  const docKey = fields.filter((field) => field.key.includes("_doc"))[0]?.key;
  return docKey;
};

export default httpTrigger;
