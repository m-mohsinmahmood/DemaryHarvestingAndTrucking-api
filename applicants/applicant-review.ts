import * as _ from "lodash";

let status_bar = {
    "Application Submitted": "step_one_status_date",
    "Preliminary Review": "step_two_status_date",
    "First Interview Completed": "step_three_status_date",
    "Second Interview Completed": "step_four_status_date",
    "Reference Call Completed": "step_five_status_date",
    "Third Interview Completed": "step_six_status_date",
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
    "Reference Call Completed": "reference_interviewer_id",
    "Third Interview Completed": "third_interviewer_id"
};
let make_employee_query;
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
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_three_status_date" = now()
                `;
                break;

            case "Second Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "second_call_ranking" = '${applicant.second_call_ranking}',
                        "second_call_remarks" = $$${applicant.second_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_four_status_date" = now()
                `;
                break;

            case "Third Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "third_call_ranking" = '${applicant.third_call_ranking}',
                        "third_call_remarks" = $$${applicant.third_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_six_status_date" = now()
                `;
                break;

            case "Reference Call Completed":
                update_applicant_query = update_applicant_query + `
                        "reference_call_ranking" = '${applicant.reference_call_ranking}',
                        "reference_call_remarks" = $$${applicant.reference_call_remarks}$$,
                        "status_message" = '${applicant.status_message}',
                        "status_step" = '${applicant.status_step}',
                        "ranking" = '${applicant.ranking}',
                        "step_five_status_date" = now()
                        
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
                        "${status_bar[applicant.prev_status_message]}" = now()
                        ${interview_step}
                `;
                break;

            case "First Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$
                        ${interview_step}
                `;
                break;

            case "Second Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$
                        ${interview_step}
                `;
                break;

            case "Third Interview Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$
                        ${interview_step}
                `;
                break;

            case "Reference Call Completed":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$
                        ${interview_step}
                `;
                break;

            case "Recuiter Decision Made":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Offer Made":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '8',
                        "status_message" = 'Offer Accepted',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Offer Accepted":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            case "Results":
                update_applicant_query = update_applicant_query + `
                        "status_step" = '${applicant.status_step}',
                        "status_message" = '${applicant.status_message}',
                        "reason_for_rejection" = $$${applicant.reason_for_rejection}$$,
                        "${status_bar[applicant.prev_status_message]}" = now()
                `;
                break;

            default:
                break;
        }
    }

    update_applicant_query = update_applicant_query + `
                        WHERE "id" = '${applicant.id}';
    `;

    // Create employee if applicant accepts offer
    if (applicant.status_message == 'Results' && applicant.status_step == '10.1') {
        make_employee_query = `
        INSERT INTO 
                    "Employees" 
                (
                    "first_name",
                    "last_name",
                    "email",
                    "cell_phone_number",
                    "cell_phone_country_code",
                    "home_phone_number",
                    "home_phone_country_code"
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
                    "degree_name",
                    "reason_for_applying",
                    "hear_about_dht",
                    "us_phone_number",
                    "blood_type",
                    "emergency_contact_name",
                    "emergency_contact_phone",
                    "status_step",
                    "unique_fact",
                    "current_employer",
                    "current_position_title",
                    "current_description_of_role",
                    "current_employment_period_start", 
                    "current_employment_period_end",
                    "current_supervisor_reference",
                    "current_supervisor_phone_number",
                    "current_contact_supervisor",
                    "previous_employer",
                    "previous_position_title",
                    "previous_description_of_role",
                    "previous_employment_period_start",
                    "previous_employment_period_end",
                    "previous_supervisor_reference",
                    "previous_supervisor_phone_number",
                    "previous_contact_supervisor",
                    "school_college",
                    "graduation_year",
                    "resume",
                    "created_at"
                )
    VALUES      (  
                    $$${applicant_info.first_name}$$,
                    $$${applicant_info.last_name}$$,
                    '${applicant_info.email}',
                    '${applicant_info.cell_phone_number}',
                    '${applicant_info.cell_phone_country_code}',
                    '${applicant_info.home_phone_number}',
                    '${applicant_info.home_phone_country_code}',
                    '${applicant_info.date_of_birth}',
                    '${applicant_info.age}',
                    '${applicant_info.marital_status}',
                    '${applicant_info.languages}',
                    '${applicant_info.rank_speaking_english}',
                    $$${applicant_info.address_1}$$,
                    $$${applicant_info.address_2}$$,
                    '${applicant_info.town_city}',
                    '${applicant_info.county_providence}',
                    '${applicant_info.state}',
                    '${applicant_info.postal_code}',
                    '${applicant_info.country}',
                    '${applicant_info.avatar}',
                    '${applicant_info.question_1}',
                    '${applicant_info.question_2}',
                    '${applicant_info.question_3}',
                    '${applicant_info.question_4}',
                    '${applicant_info.question_5}',
                    '${applicant_info.authorized_to_work}',
                    '${applicant_info.us_citizen}',
                    '${applicant_info.cdl_license}',
                    '${applicant_info.lorry_license}',
                    '${applicant_info.tractor_license}',
                    '${applicant_info.passport}',
                    $$${applicant_info.work_experience_description}$$,
                    '${applicant_info.degree_name}',
                    $$${applicant_info.reason_for_applying}$$,
                    '${applicant_info.hear_about_dht}',
                    '${applicant_info.us_phone_number}',
                    '${applicant_info.blood_type}',
                    '${applicant_info.emergency_contact_name}',
                    '${applicant_info.emergency_contact_phone}',
                    '2',
                    $$${applicant_info.unique_fact}$$,
                    '${applicant_info.current_employer}',
                    '${applicant_info.current_position_title}',
                    $$${applicant_info.current_description_of_role}$$,
                    '${applicant_info.current_employment_period_start}',
                    '${applicant_info.current_employment_period_end}',
                    '${applicant_info.current_supervisor_reference}',
                    '${applicant_info.current_supervisor_phone_number}',
                    '${applicant_info.current_contact_supervisor}',
                    '${applicant_info.previous_employer}',
                    '${applicant_info.previous_position_title}',
                    $$${applicant_info.previous_description_of_role}$$,
                    '${applicant_info.previous_employment_period_start}',
                    '${applicant_info.previous_employment_period_end}',
                    '${applicant_info.previous_supervisor_reference}',
                    '${applicant_info.previous_supervisor_phone_number}',
                    '${applicant_info.previous_contact_supervisor}',
                    '${applicant_info.school_college}',
                    '${applicant_info.graduation_year}',
                    '${applicant_info.resume}',
                    'now()'
                )
                RETURNING id as employee_id
    `;

        query = `${update_applicant_query} ${make_employee_query}`;
    }
    else {
        query = `${update_applicant_query};`
    }

    console.log("Applicant update_applicant_query", query);
    return query;

}