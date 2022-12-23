import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { applicant } from "./model";
import { BlobServiceClient } from '@azure/storage-blob';
import parseMultipartFormData from "@anzp/azure-function-multipart";
const sgMail = require('@sendgrid/mail')


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  //#region Variables
  const db = new Client(config);
  const db1 = new Client(config);
  let result;
  let query;
  let applicant_id;
  let file_name;
  const multiPartConfig = {
    limits: { fields: 1 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  //#endregion
  //#region Create Applicant
  try {
    
    const applicant: applicant = (JSON.parse(fields[0].value));
    applicant.avatar = '';

    let query = `
    INSERT INTO 
                "Applicants" 
                (
                  "first_name",
                  "last_name",
                  "email",
                  "cell_phone_number",
                  "home_phone_number",
                  "date_of_birth",
                  "age",
                  "marital_status",
                  "languages",
                  "rank_speaking_english",
                  "address_1",
                  "address_2",
                  "town_city",
                  "county_providence",
                  "state",
                  "postal_code",
                  "country",
                  "avatar",
                  "question_1",
                  "question_2",
                  "question_3",
                  "question_4",
                  "question_5",
                  "authorized_to_work",
                  "us_citizen",
                  "cdl_license",
                  "lorry_license",
                  "tractor_license",
                  "passport",
                  "work_experience_description",
                  "employment_period",
                  "supervisor_name",
                  "supervisor_contact",
                  "degree_name",
                  "reason_for_applying",
                  "hear_about_dht",
                  "us_phone_number",
                  "blood_type",
                  "emergency_contact_name",
                  "emergency_contact_phone",
                  "status_step",
                  "status_message",
                  "unique_fact",
                  "created_at"
                )
      VALUES      
                (
                  '${applicant.first_name}',
                  '${applicant.last_name}',
                  '${applicant.email}',
                  '${applicant.cell_phone_number}',
                  '${applicant.home_phone_number}',
                  '${applicant.date_of_birth}',
                  '${applicant.age}',
                  '${applicant.marital_status}',
                  '${applicant.languages}',
                  '${applicant.rank_speaking_english}',
                  '${applicant.address_1}',
                  '${applicant.address_2}',
                  '${applicant.town_city}',
                  '${applicant.county_providence}',
                  '${applicant.state}',
                  '${applicant.postal_code}',
                  '${applicant.country}',
                  '${applicant.avatar}',
                  '${applicant.question_1}',
                  '${applicant.question_2}',
                  '${applicant.question_3}',
                  '${applicant.question_4}',
                  '${applicant.question_5}',
                  '${applicant.authorized_to_work}',
                  '${applicant.us_citizen}',
                  '${applicant.cdl_license}',
                  '${applicant.lorry_license}',
                  '${applicant.tractor_license}',
                  '${applicant.passport}',
                  '${applicant.work_experience_description}',
                  '${applicant.employment_period}',
                  '${applicant.supervisor_name}',
                  '${applicant.supervisor_contact}',
                  '${applicant.degree_name}',
                  '${applicant.reason_for_applying}',
                  '${applicant.hear_about_dht}',
                  '${applicant.us_phone_number}',
                  '${applicant.blood_type}',
                  '${applicant.emergency_contact_name}',
                  '${applicant.emergency_contact_phone}',
                  '2',
                  'Preliminary Review',
                  '${applicant.unique_fact}',
                  'now()'
                )
                RETURNING id as applicant_id
    `;
    db.connect();
    result = await db.query(query);
  } catch (error) {
    db.end();
    context.res = {
      status: 400,
      body: {
        message: error.message,
        issue: "Daddy Issue"
      },
    };
    context.done();
    return;
  }
  
  //#endregion
  //#region Upload Applicant Avatar
try {
    applicant_id = result.rows[0].applicant_id;
    const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/applicants?sp=racw&st=2022-12-23T16:39:56Z&se=2025-01-01T00:39:56Z&spr=https&sv=2021-06-08&sr=c&sig=Jsxo862%2FCE8ooBBhlzWEJrZ7hRkFRpqDWCY4PFYQH9U%3D");
    const container = blob.getContainerClient("applicants");
    file_name = "image" + applicant_id;
    const blockBlob = container.getBlockBlobClient(file_name);
      const uploadFileResp = await blockBlob.uploadData(files[0].bufferFile, {
        blobHTTPHeaders: { blobContentType: files[0].mimeType },
      });
    }
    catch(error){
        context.res = {
          status: 400,
          body: {
            message: error,
            issue: "Mommy Issue"
          },
        };
        context.done();
        return;
    }
  //#endregion
  //#region Update Applicant
  try {
    let update_query = `
    UPDATE "Applicants"
    SET 
    "avatar" = 'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/ + ${file_name}'
    WHERE 
    "id" = '${applicant_id}';`
    db1.connect();
    await db.query(update_query);
    db1.end();  
  } catch (error) {
    db1.end();
    context.res = {
      status: 400,
      body: {
        message: error,
        issue: "Step Issue"
      },
    };
    context.done();
    return;
  }
  //#endregion
  //#region Success Return
  context.res = {
    status: 200,
    body: {
      message: "Your form has been submitted successfully.",
    },
  };
  context.done();
  return;
  //#endregion
};

export default httpTrigger;
