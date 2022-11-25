import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const applicant_id: string = req.query.id;
    let applicant_query = `
    SELECT 
            "id",
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
            "first_call_remarks",
            "first_call_ranking",
            "first_interviewer_id",
            "reference_phone_call",
            "reference_call_remarks",
            "reference_call_ranking",
            "reference_interviewer_id",
            "second_call_remarks",
            "second_call_ranking",
            "second_interviewer_id",
            "third_call_remarks",
            "third_call_ranking",
            "third_interviewer_id",
            "status_step",
            "status_message",
            "step_one_status_date",
            "step_two_status_date",
            "step_three_status_date",
            "step_four_status_date",
            "step_five_status_date",
            "step_six_status_date",
            "step_seven_status_date",
            "step_eight_status_date",
            "step_nine_status_date",
            "step_ten_status_date",
            "step_eleven_status_date",
            "step_twelve_status_date",
            "step_thirteen_status_date"
    FROM 
            "Applicants"
    WHERE 
            "id" = '${applicant_id}';
      `;

    db.connect();

    let result = await db.query(applicant_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No applicant exists with this id.",
      };

    db.end();

    context.res = {
      status: 200,
      body: resp,
    };

    context.done();
    return;
  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    context.done();
    return;
  }
};

export default httpTrigger;
