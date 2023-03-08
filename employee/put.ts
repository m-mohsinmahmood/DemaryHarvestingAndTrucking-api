import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { employee } from "./model";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { BlobServiceClient } from '@azure/storage-blob';


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  let query;
  let doc;
  let resume_file_url;
  let image_file_url;
  let resume;
  let image;

  const multiPartConfig = {
    limits: { fields: 3, files: 2 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  let employee: employee = JSON.parse(fields[0].value);
  files[0]?.name == 'image' ? image = files[0] : files[1]?.name == 'image' ? image = files[1] : '';
  files[0]?.name == 'resume' ? resume = files[0] : files[1]?.name == 'resume' ? resume = files[1] : '';


  try {
    let query = `
        UPDATE 
                "Employees"
        SET 
                "first_name"                            = $$${employee.first_name}$$,
                "last_name"                             = $$${employee.last_name}$$,
                "legal_name"                            = $$${employee.legal_name}$$,
                "email"                                 = $$${employee.email}$$,
                "cell_phone_number"                     = $$${employee.cell_phone_number}$$,
                "cell_phone_country_code"               = $$${employee.cell_phone_country_code}$$,
                "home_phone_number"                     = $$${employee.home_phone_number}$$,
                "home_phone_country_code"               = $$${employee.home_phone_country_code}$$,
                "date_of_birth"                         = $$${employee.date_of_birth}$$,
                "age"                                   = $$${employee.age}$$,
                "marital_status"                        = $$${employee.marital_status}$$,
                "languages"                             = $$${employee.languages}$$,
                "rank_speaking_english"                 = $$${employee.rank_speaking_english}$$,
                "address_1"                             = $$${employee.address_1}$$,
                "address_2"                             = $$${employee.address_2}$$,
                "town_city"                             = $$${employee.town_city}$$,
                "county_providence"                     = $$${employee.county_providence}$$,
                "state"                                 = $$${employee.state}$$,
                "postal_code"                           = $$${employee.postal_code}$$,
                "country"                               = $$${employee.country}$$,
                "avatar"                                = $$${employee.avatar}$$,
                "question_1"                            = $$${employee.question_1}$$,
                "question_2"                            = $$${employee.question_2}$$,
                "question_3"                            = $$${employee.question_3}$$,
                "question_4"                            = $$${employee.question_4}$$,
                "question_5"                            = $$${employee.question_5}$$,
                "authorized_to_work"                    = '${employee.authorized_to_work}',
                "us_citizen"                            = '${employee.us_citizen}',
                "cdl_license"                           = '${employee.cdl_license}',
                "lorry_license"                         = '${employee.lorry_license}',
                "tractor_license"                       = '${employee.tractor_license}',
                "passport"                              = '${employee.passport}',
                "work_experience_description"           = $$${employee.work_experience_description}$$,
                "degree_name"                           = $$${employee.degree_name}$$,
                "reason_for_applying"                   = $$${employee.reason_for_applying}$$,
                "hear_about_dht"                        = $$${employee.hear_about_dht}$$,
                "status_step"                           = '${employee.status_step}',
                "unique_fact"                           = $$${employee.unique_fact}$$,
                "current_employer"                      = $$${employee.current_employer}$$, 
                "current_position_title"                = $$${employee.current_position_title}$$,
                "current_description_of_role"           = $$${employee.current_description_of_role}$$,
                "current_employment_period_start"       = $$${employee.current_employment_period_start}$$, 
                "current_employment_period_end"         = $$${employee.current_employment_period_end}$$,
                "current_supervisor_reference"          = $$${employee.current_supervisor_reference}$$,
                "current_supervisor_phone_number"       = $$${employee.current_supervisor_phone_number}$$,
                "current_supervisor_country_code"       = $$${employee.current_supervisor_country_code}$$,
                "current_contact_supervisor"            = $$${employee.current_contact_supervisor}$$,
                "previous_employer"                     = $$${employee.previous_employer}$$,
                "previous_position_title"               = $$${employee.previous_position_title}$$,
                "previous_description_of_role"          = $$${employee.previous_description_of_role}$$,
                "previous_employment_period_start"      = $$${employee.previous_employment_period_start}$$,
                "previous_employment_period_end"        = $$${employee.previous_employment_period_end}$$,
                "previous_supervisor_reference"         = $$${employee.previous_supervisor_reference}$$,
                "previous_supervisor_phone_number"      = $$${employee.previous_supervisor_phone_number}$$,
                "previous_supervisor_country_code"      = $$${employee.previous_supervisor_country_code}$$,
                "previous_contact_supervisor"           = $$${employee.previous_contact_supervisor}$$,
                "school_college"                        = $$${employee.school_college}$$,
                "graduation_year"                       = $$${employee.graduation_year}$$,
                "resume"                                = $$${employee.resume}$$,
                "employment_period"                     = $$${employee.employment_period}$$,
                "modified_at"                           = 'now()'
        WHERE 
                "id" = '${employee.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();


    if (files.length > 0) {
      //#region Upload Applicant Avatar
      try {
        const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/applicants?sp=racw&st=2022-12-23T16:39:56Z&se=2025-01-01T00:39:56Z&spr=https&sv=2021-06-08&sr=c&sig=Jsxo862%2FCE8ooBBhlzWEJrZ7hRkFRpqDWCY4PFYQH9U%3D");
        const container = blob.getContainerClient("applicants");
        if (resume) {
          resume_file_url = "resume" + employee.id;
          const resumeBlockBlob = container.getBlockBlobClient(resume_file_url);
          const res = await resumeBlockBlob.uploadData(resume.bufferFile, {
            blobHTTPHeaders: { blobContentType: resume.mimeType },
          });
        }
        if (image) {
          image_file_url = "image" + employee.id;
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
            message: "An error occured while updating the Employee",
          },
        };
        context.done();
        return;
      }
      //#endregion
      //#region Update Applicant
      try {
        let update_query = `
      UPDATE      "Employees"
      SET `;
        image && resume ? 
        update_query = update_query + ` 
        "avatar" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + image_file_url}', 
        "resume" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + resume_file_url}' ` : '';
        image && !resume ? update_query = update_query + ` "avatar" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + image_file_url}' ` : '';
        resume && !image ? update_query = update_query + ` "resume" = '${'https://dhtstorageaccountdev.blob.core.windows.net/applicants/applicants/' + resume_file_url}' ` : '';
        update_query = update_query +
          `WHERE 
                "id" = '${employee.id}';`;
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
