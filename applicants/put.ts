import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { applicant } from "./model";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { BlobServiceClient } from '@azure/storage-blob';


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  let resume_file_url;
  let image_file_url;
  let resume;
  let image;

  const multiPartConfig = {
    limits: { fields: 3, files: 2 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  let applicant: applicant = JSON.parse(fields[0].value);
  files[0]?.name == 'image' ? image = files[0] : files[1]?.name == 'image' ? image = files[1] : '';
  files[0]?.name == 'resume' ? resume = files[0] : files[1]?.name == 'resume' ? resume = files[1] : '';


  try {
    let query = `
        UPDATE 
                "Applicants"
        SET 
                "first_name"                            = $$${applicant.first_name}$$,
                "last_name"                             = $$${applicant.last_name}$$,
                "legal_name"                            = $$${applicant.legal_name}$$,
                "email"                                 = $$${applicant.email}$$,
                "cell_phone_number"                     = $$${applicant.cell_phone_number}$$,
                "cell_phone_country_code"               = $$${applicant.cell_phone_country_code}$$,
                "home_phone_number"                     = $$${applicant.home_phone_number}$$,
                "home_phone_country_code"               = $$${applicant.home_phone_country_code}$$,
                "date_of_birth"                         = $$${applicant.date_of_birth}$$,
                "age"                                   = $$${applicant.age}$$,
                "marital_status"                        = $$${applicant.marital_status}$$,
                "languages"                             = $$${applicant.languages}$$,
                "rank_speaking_english"                 = $$${applicant.rank_speaking_english}$$,
                "address_1"                             = $$${applicant.address_1}$$,
                "address_2"                             = $$${applicant.address_2}$$,
                "town_city"                             = $$${applicant.town_city}$$,
                "county_providence"                     = $$${applicant.county_providence}$$,
                "state"                                 = $$${applicant.state}$$,
                "postal_code"                           = $$${applicant.postal_code}$$,
                "country"                               = $$${applicant.country}$$,
                "avatar"                                = $$${applicant.avatar}$$,
                "question_1"                            = $$${applicant.question_1}$$,
                "question_2"                            = $$${applicant.question_2}$$,
                "question_3"                            = $$${applicant.question_3}$$,
                "question_4"                            = $$${applicant.question_4}$$,
                "question_5"                            = $$${applicant.question_5}$$,
                "authorized_to_work"                    = '${applicant.authorized_to_work}',
                "us_citizen"                            = '${applicant.us_citizen}',
                "cdl_license"                           = '${applicant.cdl_license}',
                "lorry_license"                         = '${applicant.lorry_license}',
                "tractor_license"                       = '${applicant.tractor_license}',
                "passport"                              = '${applicant.passport}',
                "work_experience_description"           = $$${applicant.work_experience_description}$$,
                "degree_name"                           = $$${applicant.degree_name}$$,
                "reason_for_applying"                   = $$${applicant.reason_for_applying}$$,
                "hear_about_dht"                        = $$${applicant.hear_about_dht}$$,
                "status_step"                           = '${applicant.status_step}',
                "status_message"                        = '${applicant.status_message}',
                "unique_fact"                           = $$${applicant.unique_fact}$$,
                "current_employer"                      = $$${applicant.current_employer}$$, 
                "current_position_title"                = $$${applicant.current_position_title}$$,
                "current_description_of_role"           = $$${applicant.current_description_of_role}$$,
                "current_employment_period_start"       = $$${applicant.current_employment_period_start}$$, 
                "current_employment_period_end"         = $$${applicant.current_employment_period_end}$$,
                "current_supervisor_reference"          = $$${applicant.current_supervisor_reference}$$,
                "current_supervisor_phone_number"       = $$${applicant.current_supervisor_phone_number}$$,
                "current_supervisor_country_code"       = $$${applicant.current_supervisor_country_code}$$,
                "current_contact_supervisor"            = $$${applicant.current_contact_supervisor}$$,
                "previous_employer"                     = $$${applicant.previous_employer}$$,
                "previous_position_title"               = $$${applicant.previous_position_title}$$,
                "previous_description_of_role"          = $$${applicant.previous_description_of_role}$$,
                "previous_employment_period_start"      = $$${applicant.previous_employment_period_start}$$,
                "previous_employment_period_end"        = $$${applicant.previous_employment_period_end}$$,
                "previous_supervisor_reference"         = $$${applicant.previous_supervisor_reference}$$,
                "previous_supervisor_phone_number"      = $$${applicant.previous_supervisor_phone_number}$$,
                "previous_supervisor_country_code"      = $$${applicant.previous_supervisor_country_code}$$,
                "previous_contact_supervisor"           = $$${applicant.previous_contact_supervisor}$$,
                "school_college"                        = $$${applicant.school_college}$$,
                "graduation_year"                       = $$${applicant.graduation_year}$$,
                "resume"                                = $$${applicant.resume}$$,
                "employment_period"                     = $$${applicant.employment_period}$$,
                "applied_job"                           = $$${applicant.applied_job}$$,  
                "modified_at"                           = 'now()',
                "whatsapp_number"                       = $$${applicant.whatsapp_number}$$,
                "whatsapp_country_code"                 = $$${applicant.whatsapp_country_code}$$

        WHERE 
                "id" = '${applicant.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();


    if (files.length > 0) {
      //#region Upload Applicant Avatar
      try {
        const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/applicants?sp=racw&st=2022-12-23T16:39:56Z&se=2025-01-01T00:39:56Z&spr=https&sv=2021-06-08&sr=c&sig=Jsxo862%2FCE8ooBBhlzWEJrZ7hRkFRpqDWCY4PFYQH9U%3D");
        const container = blob.getContainerClient("applicants");
        if (resume) {
          resume_file_url = "resume" + applicant.id;
          const resumeBlockBlob = container.getBlockBlobClient(resume_file_url);
          const res = await resumeBlockBlob.uploadData(resume.bufferFile, {
            blobHTTPHeaders: { blobContentType: resume.mimeType },
          });
        }
        if (image) {
          image_file_url = "image" + applicant.id;
          const blockBlob = container.getBlockBlobClient(image_file_url);
          const uploadFileResp = await blockBlob.uploadData(image.bufferFile, {
            blobHTTPHeaders: { blobContentType: image.mimeType },
          });
        }
      }
      catch (error) {
        context.res = {
          status: 400,
          body: {
            message: "An error occured while updating the Applicant",
          },
        };
        context.done();
        return;
      }
      //#endregion
      //#region Update Applicant
      try {
        let update_query = `
      UPDATE      "Applicants"
      SET `;
        image && resume ? 
        update_query = update_query + ` 
        "avatar" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + image_file_url}', 
        "resume" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + resume_file_url}' ` : '';
        image && !resume ? update_query = update_query + ` "avatar" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + image_file_url}' ` : '';
        resume && !image ? update_query = update_query + ` "resume" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + resume_file_url}' ` : '';
        update_query = update_query +
          `WHERE 
                "id" = '${applicant.id}';`;
        db1.connect();
        await db1.query(update_query);
        db1.end();
      } catch (error) {
        db1.end();
        context.res = {
          status: 400,
          body: {
            message: "An error occured while creating the Applicant",
          },
        };
        context.done();
        return;
      }
    }
    //#endregion
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
