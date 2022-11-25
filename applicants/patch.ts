import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { applicant } from "./model";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const applicant: applicant = req.body.applicant_data;
    const email: any = req.body.email_data;

    let status_bar = {
      "Applicant Completed"                         : "step_one_status_date",
      "Advance Preliminary Review"                  : "step_two_status_date",
      "First Interview Completed"                   : "step_three_status_date",
      "Second Interview Completed"                  : "step_four_status_date",
      "Third Interview Completed"                   : "step_five_status_date",
      "Reference Call Completed"                    : "step_six_status_date",
      "Recruiter Decision Made"                     : "step_seven_status_date",
      "Offer Made"                                  : "step_eight_status_date",
      "Offer Accepted"                              : "step_nine_status_date",
      "Advance to Pre-Employment Process"           : "step_ten_status_date",
      "Results"                                     : "step_eleven_status_date",
      "Hired"                                       : "step_twelve_status_date",
      "Waitlisted"                                  : "step_thirteen_status_date",
      "Qualifications don't match current openings" : "step_fourteen_status_date"
    };

    let interview_step = {
      "First Interview Completed"  : "first_interviewer_id",
      "Second Interview Completed" : "second_interviewer_id",
      "Third Interview Completed"  : "third_interviewer_id",
      "Reference Call Completed"   : "reference_interviewer_id"
    };

    let query = `
        UPDATE 
                "Applicants"
        SET 
                "status_step"                                 = '${applicant.status_step}',
                "status_message"                              = '${applicant.status_message}',
                "${interview_step[applicant.status_message]}" = '${email.recruiter_id}',
                "${status_bar[applicant.status_message]}"     = 'now()'

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
