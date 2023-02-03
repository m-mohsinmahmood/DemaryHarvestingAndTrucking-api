import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { policy_docs } from "./model";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { BlobServiceClient } from '@azure/storage-blob';


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const db = new Client(config);
    let query;

    const multiPartConfig = {
        limits: { fields: 1, files: 1 },
    };
    const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
    let policy_doc = (JSON.parse(fields[0].value));

    // Update Policy Document
    try {
        query = `
        UPDATE "Policy_Documents"
        SET 
                        "Document_name" = '${policy_doc.name}',
        Where "id" =    '${policy_doc.id}
        `;

        db.connect();
        let result = await db.query(query);
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
    // try {
    //     const random_num = Math.random() * 1000;
    //     const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/employees?sp=rawd&st=2023-01-14T11:52:11Z&se=2024-12-31T19:52:11Z&spr=https&sv=2021-06-08&sr=c&sig=qsEWo%2F1vfQzmw9V8HdI%2FEfL1R4l3hho4wd49Czmq%2BC8%3D");
    //     const container = blob.getContainerClient("employees");
    //     doc = "doc" + Math.round(random_num) + employee_id;
    //     const blockBlob = container.getBlockBlobClient(doc);
    //     const uploadFileResp = await blockBlob.uploadData(files[0].bufferFile, {
    //         blobHTTPHeaders: { blobContentType: files[0].mimeType },
    //     });
    // }
    // catch (error) {
    //     context.res = {
    //         status: 400,
    //         body: {
    //             message: error,
    //         },
    //     };
    //     context.done();
    //     return;
    // }

    // try {
    //     let update_query = `
    //   UPDATE "Employee_Documents"
    //   SET 
    //   ${doc_name} = '${'https://dhtstorageaccountdev.blob.core.windows.net/employees/employees/' + doc}'
    //   WHERE 
    //   "employee_id" = '${employee_id}';`
    //     db1.connect();
    //     await db1.query(update_query);
    //     db1.end();
    // } catch (error) {
    //     db1.end();
    //     context.res = {
    //         status: 400,
    //         body: {
    //             message: error,
    //         },
    //     };
    //     context.done();
    //     return;
    // }

    context.res = {
        status: 200,
        body: {
            message: "Policy Documents has been updated successfully.",
        },
    };
    context.done();
    return;


    // Update Document from blob
};

export default httpTrigger;
