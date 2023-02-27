import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { policy_docs } from "./model";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { BlobServiceClient } from '@azure/storage-blob';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  let doc;
  let policy_document_id;
  let result;

  const multiPartConfig = {
    limits: { fields: 1, files: 1 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  let policy_doc = (JSON.parse(fields[0].value));

  try {
    let query = `
    INSERT INTO 
                "Policy_Documents" 
                (
                "employee_id",
                "document_name",
                "employment_period",
                "document_type",
                "category",
                "created_at" 
                )
      VALUES      
                (
                '${policy_doc.employee_id}',
                '${policy_doc.name}',
                '${policy_doc.employment_period}',
                '${policy_doc.type}',
                '${policy_doc.category}',
                'now()'
                )
                RETURNING id as policy_document_id
    `;

    db.connect();
    result = await db.query(query);
    db.end();
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

  // Blob
  try {
    policy_document_id = result.rows[0].policy_document_id;
    const random_num = Math.random() * 1000;
    const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/employees?sp=rawd&st=2023-01-14T11:52:11Z&se=2024-12-31T19:52:11Z&spr=https&sv=2021-06-08&sr=c&sig=qsEWo%2F1vfQzmw9V8HdI%2FEfL1R4l3hho4wd49Czmq%2BC8%3D");
    const container = blob.getContainerClient("employees");
    doc = "doc" + Math.round(random_num) + policy_document_id;
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
    UPDATE "Policy_Documents"
    SET 
    "document_url" = '${'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/' + doc}'
    WHERE 
    "id" = '${policy_document_id}';`
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

  context.res = {
    status: 200,
    body: {
      message: "Policy Document has been Added successfully.",
    },
  };
  context.done();
  return;


  // Update Document from blob
};

export default httpTrigger;
