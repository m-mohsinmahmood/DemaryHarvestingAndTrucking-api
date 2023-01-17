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
                "first_name"                    = $$${applicant.first_name}$$,
                "last_name"                     = $$${applicant.last_name}$$,
                "email"                         = '${applicant.email}',
                "cell_phone_number"             = '${applicant.cell_phone_number}',
                "home_phone_number"             = '${applicant.home_phone_number}',
                "date_of_birth"                 = '${applicant.date_of_birth}',
                "age"                           = '${applicant.age}',
                "marital_status"                = '${applicant.marital_status}',
                "languages"                     = '${applicant.languages}',
                "rank_speaking_english"         = '${applicant.rank_speaking_english}',
                "address_1"                     = $$${applicant.address_1}$$,
                "address_2"                     = $$${applicant.address_2}$$,
                "town_city"                     = $$${applicant.town_city}$$,
                "county_providence"             = $$${applicant.county_providence}$$,
                "state"                         = '${applicant.state}',
                "postal_code"                   = '${applicant.postal_code}',
                "country"                       = '${applicant.country}',
                "avatar"                        = '${applicant.avatar}',
                "question_1"                    = '${applicant.question_1}',
                "question_2"                    = '${applicant.question_2}',
                "question_3"                    = '${applicant.question_3}',
                "question_4"                    = '${applicant.question_4}',
                "question_5"                    = '${applicant.question_5}',
                "authorized_to_work"            = '${applicant.authorized_to_work}',
                "us_citizen"                    = '${applicant.us_citizen}',
                "cdl_license"                   = '${applicant.cdl_license}',
                "lorry_license"                 = '${applicant.lorry_license}',
                "tractor_license"               = '${applicant.tractor_license}',
                "passport"                      = '${applicant.passport}',
                "work_experience_description"   = $$${applicant.work_experience_description}$$,
                "employment_period"             = '${applicant.employment_period}',
                "supervisor_name"               = '${applicant.supervisor_name}',
                "supervisor_contact"            = '${applicant.supervisor_contact}',
                "degree_name"                   = '${applicant.degree_name}',
                "reason_for_applying"           = '${applicant.reason_for_applying}',
                "hear_about_dht"                = '${applicant.hear_about_dht}',
                "us_phone_number"               = '${applicant.us_phone_number}',
                "blood_type"                    = '${applicant.blood_type}',
                "emergency_contact_name"        = '${applicant.emergency_contact_name}',
                "emergency_contact_phone"       = '${applicant.emergency_contact_phone}',
                "unique_fact"                   = $$${applicant.unique_fact}$$,
                "first_call_remarks"            = $$${applicant.first_call_remarks}$$,
                "first_call_ranking"            = '${applicant.first_call_ranking}',
                "first_interviewer_id"          = '${applicant.first_interviewer_id}',
                "reference_call_remarks"        = $$${applicant.reference_call_remarks}$$,
                "reference_call_ranking"        = '${applicant.reference_call_ranking}',
                "reference_interviewer_id"      = '${applicant.reference_interviewer_id}',
                "second_call_remarks"           = $$${applicant.second_call_remarks}$$,
                "second_call_ranking"           = '${applicant.second_call_ranking}',
                "second_interviewer_id"         = '${applicant.second_interviewer_id}',
                "third_call_remarks"            = $$${applicant.third_call_remarks}$$,
                "third_call_ranking"            = '${applicant.third_call_ranking}',
                "third_interviewer_id"          = '${applicant.third_interviewer_id}',
                "status_step"                   = '${applicant.status_step}',
                "status_message"                = '${applicant.status_message}',
                "step_one_status_date"          = '${applicant.step_one_status_date}',
                "step_two_status_date"          = '${applicant.step_two_status_date}',
                "step_three_status_date"        = '${applicant.step_three_status_date}',
                "step_four_status_date"         = '${applicant.step_four_status_date}',
                "step_five_status_date"         = '${applicant.step_five_status_date}',
                "step_six_status_date"          = '${applicant.step_six_status_date}',
                "step_seven_status_date"        = '${applicant.step_seven_status_date}',
                "step_eight_status_date"        = '${applicant.step_eight_status_date}',
                "step_nine_status_date"         = '${applicant.step_nine_status_date}',
                "step_ten_status_date"          = '${applicant.step_ten_status_date}',
                "step_eleven_status_date"       = '${applicant.step_eleven_status_date}',
                "step_twelve_status_date"       = '${applicant.step_twelve_status_date}',
                "step_thirteen_status_date"     = '${applicant.step_thirteen_status_date}'
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
