import * as _ from "lodash";

let status_bar = {
    "Application Submitted": "step_one_status_date",
    "Preliminary Review": "step_two_status_date",
    "First Interview Completed": "step_three_status_date",
    "Second Interview Completed": "step_four_status_date",
    "Third Interview Completed": "step_five_status_date",
    "Reference Call Completed": "step_six_status_date",
    "Recruiter Decision Made": "step_seven_status_date",
    "Offer Made": "step_eight_status_date",
    "Offer Accepted": "step_nine_status_date",
    "Advance to Pre-Employment Process": "step_ten_status_date",
    "Results": "step_eleven_status_date",
    "Hired": "step_twelve_status_date",
    "Waitlisted": "step_thirteen_status_date",
    "Qualifications dont match current openings": "step_fourteen_status_date"
};

let interview_steps = {
    "First Interview Completed": "first_interviewer_id",
    "Second Interview Completed": "second_interviewer_id",
    "Third Interview Completed": "third_interviewer_id",
    "Reference Call Completed": "reference_interviewer_id"
};

export function updateQuery(applicant, email, type) {
    
    let query = `
                UPDATE "Applicants"
                SET 
        `;

    if (type === "recruiter") {
        switch (applicant.status_message) {

            case "First Interview Completed":
                query = query + `
                        "first_call_ranking" = '${applicant.first_call_ranking}',
                        "first_call_remarks" = '${applicant.first_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "step_three_status_date" = now()
                `;
            break;

            case "Second Interview Completed":
                query = query + `
                        "second_call_ranking" = '${applicant.second_call_ranking}',
                        "second_call_remarks" = '${applicant.second_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "step_four_status_date" = now()
                `;
            break;

            case "Third Interview Completed":
                query = query + `
                        "third_call_ranking" = '${applicant.third_call_ranking}',
                        "third_call_remarks" = '${applicant.third_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "step_five_status_date" = now()
                `;
            break;

            case "Reference Call Completed":
                query = query + `
                        "reference_call_ranking" = '${applicant.reference_call_ranking}',
                        "reference_call_remarks" = '${applicant.reference_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "step_six_status_date" = now()
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
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                        ${interview_step}
                `;
            break;
            
            case "First Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}'
                        ${interview_step}
                `;
            break;
                
            case "Second Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}'
                        ${interview_step}
                `;
            break;
                
            case "Third Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}'
                        ${interview_step}
                `;
            break;
            
            case "Reference Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}'
                        ${interview_step}
                `;
            break;
                
            case "Recuiter Decision Made":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
            break;

            case "Offer Made":
                query = query + `
                        "status_step" = '8',
                        "status_message" = 'Offer Accepted',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
            break;

            case "Offer Accepted":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
            break;

            case "Results":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "${status_bar["Offer Accepted"]}" = now(),
                        "${status_bar["Results"]}" = now()
                `;
            break;

            default:
            break;
        }
    }

    query = query + `
                        WHERE "id" = '${applicant.id}';
    `;

    console.log("Applicant Query",query);
    return query;

}