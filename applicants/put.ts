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
                "first_name"                   = '${applicant.first_name}',
                "last_name"                    = '${applicant.last_name}',
                "email"                        = '${applicant.email}',
                "cell_phone_number"            = '${applicant.cell_phone_number}',
                "home_phone_number"            = '${applicant.home_phone_number}',
                "calendar_year"                = '${applicant.calendar_year}',
                "languages"                    = '${applicant.languages}',
                "date_of_birth"                = '${applicant.date_of_birth}',
                "marital_status"               = '${applicant.marital_status}',
                "address_1"                    = '${applicant.address_1}',
                "address_2"                    = '${applicant.address_2}',
                "postal_code"                  = '${applicant.postal_code}',
                "country"                      = '${applicant.country}',
                "county"                       = '${applicant.county}',
                "city"                         = '${applicant.city}',
                "self_rating"                  = '${applicant.self_rating}',
                "us_citizen"                   = '${applicant.us_citizen}',
                "tractor_license"              = '${applicant.tractor_license}',
                "passport"                     = '${applicant.passport}',
                "avatar"                       = '${applicant.avatar}',
                "resume"                       = '${applicant.resume}',
                "question_1"                   = '${applicant.question_1}',
                "question_2"                   = '${applicant.question_2}',
                "question_3"                   = '${applicant.question_3}',
                "question_4"                   = '${applicant.question_4}',
                "question_5"                   = '${applicant.question_5}',
                "work_experience_description"  = '${applicant.work_experience_description}',
                "recent_job"                   = '${applicant.recent_job}',
                "supervisor"                   = '${applicant.supervisor}',
                "supervisor_contact"           = '${applicant.supervisor_contact}',
                "degree_name"                  = '${applicant.degree_name}',
                "institute_name"               = '${applicant.institute_name}',
                "education"                    = '${applicant.education}',
                "blood_group"                  = '${applicant.blood_group}',
                "reason_for_applying"          = '${applicant.reason_for_applying}',
                "first_call_remarks"           = '${applicant.first_call_remarks}',
                "first_call_ranking"           = '${applicant.first_call_ranking}',
                "first_interviewer_id"         = '${applicant.first_interviewer_id}',
                "second_call_remarks"          = '${applicant.second_call_remarks}',
                "second_call_ranking"          = '${applicant.second_call_ranking}',
                "second_interviewer_id"        = '${applicant.second_interviewer_id}',
                "third_call_remarks"           = '${applicant.third_call_remarks}',
                "third_call_ranking"           = '${applicant.third_call_ranking}',
                "third_interviewer_id"         = '${applicant.third_interviewer_id}',
                "reference_call_remarks"       = '${applicant.reference_call_remarks}',
                "reference_call_ranking"       = '${applicant.reference_call_ranking}',
                "reference_interviewer_id"     = '${applicant.reference_interviewer_id}',
                "statusStep"                   = '${applicant.status_step}',
                "statusMessage"                = '${applicant.status_message}',
                "stepOneStatusDate"            = '${applicant.stepOneStatusDate}',
                "stepTwoStatusDate"            = '${applicant.stepTwoStatusDate}',
                "stepThreeStatusDate"          = '${applicant.stepThreeStatusDate}',
                "stepFourStatusDate"           = '${applicant.stepFourStatusDate}',
                "stepFiveStatusDate"           = '${applicant.stepFiveStatusDate}',
                "stepSixStatusDate"            = '${applicant.stepSixStatusDate}',
                "stepSevenStatusDate"          = '${applicant.stepSevenStatusDate}',
                "stepEightStatusDate"          = '${applicant.stepEightStatusDate}',
                "stepNineStatusDate"           = '${applicant.stepNineStatusDate}',
                "stepTenStatusDate"            = '${applicant.stepTenStatusDate}',
                "stepElevenStatusDate"         = '${applicant.stepElevenStatusDate}',
                "stepTwelveStatusDate"         = '${applicant.stepTwelveStatusDate}',
                "stepThirteenStatusDate"       = '${applicant.stepThirteenStatusDate}'

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
