import * as _ from "lodash";

let status_bar = {
    "Account Activated": "step_one_status_date",
    "Email Sent to upload Drivers License and SS card": "step_two_status_date",
    "Drivers License and SS card verified": "step_three_status_date",
    "Email sent to review/sign compliance docs": "step_four_status_date",
    "Compliance docs verified": "step_five_status_date",
    "System creates contract": "step_six_status_date",
    "Admin reviews/approves contract": "step_seven_status_date",
    "Email Sent to notify that contract and W4 posted": "step_eight_status_date",
    "Contract signed by employee verified": "step_nine_status_date",
    "Email sent to set-up online bank account": "step_ten_status_date",
    "Bank account details verified": "step_eleven_status_date",
    "Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy": "step_twelve_status_date",
    "Docs verified": "step_thirteen_status_date",
    "Email sent to complete CDL training": "step_fourteen_status_date",
    "CDL training verified": "step_fifteen_status_date",
    "Email sent to make travel arrangements": "step_sixteen_status_date",
    "Results": "step_seventeen_status_date",
    "Active": "step_eighteen_status_date",
    "In-process": "step_nineteen_status_date",
    "Inactive": "step_twenty_status_date",
};
let interview_steps = {
    "First Interview Completed": "first_interviewer_id",
    "Second Interview Completed": "second_interviewer_id",
    "Third Interview Completed": "third_interviewer_id",
    "Reference Call Completed": "reference_interviewer_id"
};

export function updateQuery(applicant, email, type) {
    
    let query = `
                UPDATE "Employees"
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
                        "ranking" = '${applicant.ranking}',
                        "step_three_status_date" = now()
                `;
            break;

            case "Second Interview Completed":
                query = query + `
                        "second_call_ranking" = '${applicant.second_call_ranking}',
                        "second_call_remarks" = '${applicant.second_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_four_status_date" = now()
                `;
            break;

            case "Third Interview Completed":
                query = query + `
                        "third_call_ranking" = '${applicant.third_call_ranking}',
                        "third_call_remarks" = '${applicant.third_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_five_status_date" = now()
                `;
            break;

            case "Reference Call Completed":
                query = query + `
                        "reference_call_ranking" = '${applicant.reference_call_ranking}',
                        "reference_call_remarks" = '${applicant.reference_call_remarks}',
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
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
                        "reason_for_rejection" = '${applicant.reason_for_rejection}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                        ${interview_step}
                `;
            break;
            
            case "First Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}'
                        ${interview_step}
                `;
            break;
                
            case "Second Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}'
                        ${interview_step}
                `;
            break;
                
            case "Third Interview Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}'
                        ${interview_step}
                `;
            break;
            
            case "Reference Call Completed":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}'
                        ${interview_step}
                `;
            break;
                
            case "Recuiter Decision Made":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
            break;

            case "Offer Made":
                query = query + `
                        "status_step" = '8',
                        "status_message" = 'Offer Accepted',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
            break;

            case "Offer Accepted":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}',
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
            break;

            case "Results":
                query = query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = '${applicant.reason_for_rejection}',
                        "${status_bar[applicant.prev_status_message]}" = now()
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