import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { applicant } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const applicant: applicant = req.body;
    let query = `
        UPDATE 
                "Applicants"
        SET 
                "first_name"                  = '${applicant.first_name}',
                "last_name"                   = '${applicant.last_name}',
                "email"                       = '${applicant.email}',
                "cell_phone_number"           = '${applicant.cell_phone_number}',
                "home_phone_number"           = '${applicant.home_phone_number}',
                "status"                      = '${applicant.status}',
                "calendar_year"               = '${applicant.calendar_year}',
                "languages"                   = '${applicant.languages}',
                "date_of_birth"               = '${applicant.date_of_birth}',
                "marital_status"              = '${applicant.marital_status}',
                "address_1"                   = '${applicant.address_1}',
                "address_2"                   = '${applicant.address_2}',
                "postal_code"                 = '${applicant.postal_code}',
                "country"                     = '${applicant.country}',
                "county"                      = '${applicant.county}',
                "city"                        = '${applicant.city}',
                "self_rating"                 = '${applicant.self_rating}',
                "us_citizen"                  = '${applicant.us_citizen}',
                "tractor_license"             = '${applicant.tractor_license}',
                "passport"                    = '${applicant.passport}',
                "avatar"                      = '${applicant.avatar}',
                "question_1"                  = '${applicant.question_1}',
                "question_2"                  = '${applicant.question_2}',
                "question_3"                  = '${applicant.question_3}',
                "question_4"                  = '${applicant.question_4}',
                "question_5"                  = '${applicant.question_5}',
                "work_experience_description" = '${applicant.work_experience_description}',
                "recent_job"                  = '${applicant.recent_job}',
                "supervisor"                  = '${applicant.supervisor}',
                "supervisor_contact"          = '${applicant.supervisor_contact}',
                "degree_name"                 = '${applicant.degree_name}',
                "institute_name"              = '${applicant.institute_name}',
                "education"                   = '${applicant.education}',
                "blood_group"                 = '${applicant.blood_group}',
                "reason_for_applying"         = '${applicant.reason_for_applying}',
                "first_phone_call"            = '${applicant.first_phone_call}',
                "first_call_remarks"          = '${applicant.first_call_remarks}',
                "reference_phone_call"        = '${applicant.reference_phone_call}',
                "reference_call_remarks"      = '${applicant.reference_call_remarks}',
                "second_phone_call"           = '${applicant.second_phone_call}',
                "second_call_remarks"         = '${applicant.second_call_remarks}',
                "third_phone_call"            = '${applicant.third_phone_call}',
                "third_call_remarks"          = '${applicant.third_call_remarks}'
        WHERE 
                "id" = '${applicant.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

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
