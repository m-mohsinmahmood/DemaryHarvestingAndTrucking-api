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
    let status_bar;
    if (result.rows.length > 0) {
      resp = result.rows[0];

      status_bar = [
        { step: `Applicant Completed`, date: resp.created_at, status: true, show: true },
        { step: `Advance Preliminary Review`, date: resp.step_two_status_date, status: true , show: true },
        { step: `First Interview Completed`, date: resp.step_three_status_date, status: +resp.status_step > 3 ? true : false, show: true },
        { step: `Second Interview Completed`, date: resp.step_four_status_date, status: +resp.status_step > 4 ? true : false, show: +resp.status_step > 4 && resp.step_four_status_date ? true : false },
        { step: `Third Interview Completed`, date: resp.step_five_status_date, status: +resp.status_step > 5 ? true : false, show: +resp.status_step > 5 && resp.step_five_status_date ? true : false },
        { step: `Reference Call Completed`, date: resp.step_six_status_date, status: +resp.status_step > 6 ? true : false, show: true },
        { step: `Recruiter Decision Made`, date: resp.step_seven_status_date, status: +resp.status_step > 7 ? true : false, show: true },
        { step: `Offer Made`, date: resp.step_eight_status_date, status: +resp.status_step > 8 ? true : false, show: true },
        { step: `Offer Accepted`, date: resp.step_nine_status_date, status: +resp.status_step > 9 ? true : false, show: true },
        { step: `Advance to Pre-Employment Process`, date: resp.step_ten_status_date, status: +resp.status_step > 10 ? true : false, show: true },
        { step: `Results`, date: resp.step_eleven_status_date, status: +resp.status_step > 10 ? true : false, show: true },
        { step: `Hired`, date: resp.step_twelve_status_date, status: +resp.status_step > 11 ? true : false, show: +resp.status_step > 11 && resp.step_four_status_date ? true : false  },
        { step: `Waitlisted`, date: resp.step_thirteen_status_date, status: +resp.status_step > 12 ? true : false, show: +resp.status_step > 12 && resp.step_four_status_date ? true : false },
        { step: `Qualifications don't match current openings`, date: resp.step_thirteen_status_date, status: +resp.status_step > 13 ? true : false, show: +resp.status_step > 13 && resp.step_four_status_date ? true : false }
      ];
    }
    else {
      resp = {
        message: "No applicant exists with this id.",
      };
    }

    db.end();

    context.res = {
      status: 200,
      body: {
        applicant_info: resp,
        applicant_status_bar: status_bar
      }
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
