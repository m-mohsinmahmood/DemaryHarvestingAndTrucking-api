import * as _ from "lodash";

let status_bar = {
    "Application Submitted": "step_one_status_date",
    "Preliminary Review": "step_three_status_date",
    "First Interview Scheduled": "step_three_status_date",
    "First Interview Completed": "step_four_status_date",
    "Second Interview Scheduled": "step_five_status_date",
    "Second Interview Completed": "step_six_status_date",
    "Scheduled Reference Call": "step_seven_status_date",
    "Reference Call Completed": "step_eight_status_date",
    "Third Interview Scheduled": "step_nine_status_date",
    "Third Interview Completed": "step_ten_status_date",
    "Recruiter Decision Made": "step_eleven_status_date",
    "Offer Made": "step_twelve_status_date",
    "Offer Accepted": "step_twelve_status_date",
    "Results": "step_thirteen_status_date",
    "Hired": "step_twelve_status_date",
    "Waitlisted": "step_twelve_status_date",
    "Qualifications dont match current openings": "step_twelve_status_date"
};

let interview_steps = {
    "First Interview Scheduled": "first_interviewer_id",
    "Second Interview Scheduled": "second_interviewer_id",
    "Scheduled Reference Call": "reference_interviewer_id",
    "Third Interview Scheduled": "third_interviewer_id"
};

let status_message_step = {
    "Preliminary Review": "2",
    "First Interview Scheduled": "3",
    "First Interview Completed": "4",
    "Second Interview Scheduled": "5",
    "Second Interview Completed": "6",
    "Reference Call Scheduled": "7",
    "Reference Call Completed": "8",
    "Third Interview Scheduled": "9",
    "Third Interview Completed": "10",
    "Offer Accepted": "11",
    "Waitlisted": "12.2",

}

let query;

export function updateQuery(applicant, email, type, applicant_info) {

    let update_applicant_query = `
                UPDATE "Applicants"
                SET 
        `;

    if (type === "recruiter") {
        switch (applicant.status_message) {

            case "First Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "first_call_ranking" = '${applicant.first_call_ranking}',
                        "first_call_remarks" = $$${applicant.first_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_four_status_date" = now()
                `;
                break;

            case "Second Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "second_call_ranking" = '${applicant.second_call_ranking}',
                        "second_call_remarks" = $$${applicant.second_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_six_status_date" = now()
                `;
                break;

            case "Third Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "third_call_ranking" = '${applicant.third_call_ranking}',
                        "third_call_remarks" = $$${applicant.third_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_ten_status_date" = now()
                `;
                break;

            case "Reference Call Completed":
                update_applicant_query = update_applicant_query + `
                        "reference_call_ranking" = '${applicant.reference_call_ranking}',
                        "reference_call_remarks" = $$${applicant.reference_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_eight_status_date" = now()
                        
                `;
                break;
            case "First Interview Updated":
                update_applicant_query = update_applicant_query + `
                        "first_call_ranking" = '${applicant.first_call_ranking}',
                        "first_call_remarks" = $$${applicant.first_call_remarks}$$,
                        "ranking" = '${applicant.ranking}',
                        "step_four_status_date" = now()

                `;
                break;
            case "Second Interview Updated":
                update_applicant_query = update_applicant_query + `
                        "second_call_ranking" = '${applicant.second_call_ranking}',
                        "second_call_remarks" = $$${applicant.second_call_remarks}$$,
                        "ranking" = '${applicant.ranking}',
                        "step_six_status_date" = now()
                    `;
                break;
            case "Third Interview Updated":
                update_applicant_query = update_applicant_query + `
                        "third_call_ranking" = '${applicant.third_call_ranking}',
                        "third_call_remarks" = $$${applicant.third_call_remarks}$$,
                        "ranking" = '${applicant.ranking}',
                        "step_ten_status_date" = now()

                    `;
                break;
            case "Reference Interview Updated":
                update_applicant_query = update_applicant_query + `
                        "reference_call_ranking" = '${applicant.reference_call_ranking}',
                        "reference_call_remarks" = $$${applicant.reference_call_remarks}$$,
                        "ranking" = '${applicant.ranking}',
                        "step_eight_status_date" = now()

                    `;
                break;
            default:
                break;
        }
    }

    else if (type === "status_bar") {
        let interview_step = ``;
        if (email?.recruiter_id && interview_steps[applicant.status_message])
            interview_step = `, "${interview_steps[applicant.status_message]}" = '${email.recruiter_id}'`;

        switch (applicant.prev_status_message) {

            case "Preliminary Review":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                        ${interview_step}
                `;
                break;

            case "First Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "step_five_status_date" = now()
                        ${interview_step}
                `;
                break;

            case "Second Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "step_seven_status_date" = now()
                        ${interview_step}
                `;
                break;

            case "Third Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "step_eleven_status_date" = now()
                        ${interview_step}
                `;
                break;

            case "Reference Call Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "step_nine_status_date" = now()
                        ${interview_step}
                `;
                break;

            case "Recruiter Decision Made":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Offer Made":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Offer Accepted":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "previous_status_message" = '${applicant.prev_status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Results":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "previous_status_message" = '${applicant.previous_status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Resume Onboarding":
                update_applicant_query = update_applicant_query + `
                    "status_step" = '${status_message_step[applicant.status_message]}',
                    "status_message" = '${applicant.status_message}' 
            `;
                break;

            default:
                break;
        }
    }

    update_applicant_query = update_applicant_query + `
            WHERE "id" = '${applicant.id}';
    `;
    query = `${update_applicant_query};`

    return query;

}