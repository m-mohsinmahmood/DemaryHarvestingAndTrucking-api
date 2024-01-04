import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const email: string = req.query.email;

        db.connect();

        let query = `
        Select id, Concat(first_name, ' ' , last_name) AS name, email
        from "Applicants" where email = '${email}';

        Select id, Concat(first_name, ' ' , last_name) AS name, email
        from "Employees" where email = '${email}';
      `;

        let result = await db.query(query);

        // Existing Applicant and also existing Employee
        // So update old details of employee and remove employee Previous data to proceed with employee onboarding process again
        const applicant_info: any = req.body?.applicantInfo;

        if (result[0].rows[0].length > 0 && result[1].rows[0].length > 0) {
            query = `
            UPDATE 
                "Employees"
            SET 
                "first_name"                                = $$${applicant_info.first_name}$$,
                "last_name"                                 = $$${applicant_info.last_name}$$,
                "legal_name"                                = $$${applicant_info.legal_name}$$,
                "email"                                     = '${applicant_info.email}',
                "cell_phone_number"                         = '${applicant_info.cell_phone_number}',
                "cell_phone_country_code"                   = '${applicant_info.cell_phone_country_code}'
                "home_phone_number"                         = '${applicant_info.home_phone_number}',
                "home_phone_country_code"                   = '${applicant_info.home_phone_country_code}',
                "date_of_birth"                             = '${applicant_info.date_of_birth}',
                "age"                                       = '${applicant_info.age}',
                "marital_status"                            = '${applicant_info.marital_status}',
                "languages"                                 = '${applicant_info.languages}',
                "rank_speaking_english"                     = '${applicant_info.rank_speaking_english}',
                "address_1"                                 = $$${applicant_info.address_1}$$,
                "address_2"                                 = $$${applicant_info.address_2}$$,
                "town_city"                                 = '${applicant_info.town_city}',
                "county_providence"                         = '${applicant_info.county_providence}',
                "state"                                     = '${applicant_info.state}',
                "postal_code"                               = '${applicant_info.postal_code}',
                "country"                                   = '${applicant_info.country}',
                "avatar"                                    = '${applicant_info.avatar}',
                "question_1"                                = '${applicant_info.question_1}',
                "question_2"                                = '${applicant_info.question_2}',
                "question_3"                                = '${applicant_info.question_3}',
                "question_4"                                = '${applicant_info.question_4}',
                "question_5"                                = '${applicant_info.question_5}',
                "authorized_to_work"                        = '${applicant_info.authorized_to_work}',
                "us_citizen"                                = '${applicant_info.us_citizen}',
                "cdl_license"                               = '${applicant_info.cdl_license}',
                "lorry_license"                             = '${applicant_info.lorry_license}',
                "tractor_license"                           = '${applicant_info.tractor_license}',
                "passport"                                  = '${applicant_info.passport}',
                "work_experience_description"               = $$${applicant_info.work_experience_description}$$,
                "degree_name"                               = '${applicant_info.degree_name}',
                "reason_for_applying"                       = $$${applicant_info.reason_for_applying}$$,
                "hear_about_dht"                            '${applicant_info.hear_about_dht}',
                "status_step"                               = '2',
                "unique_fact"                               = $$${applicant_info.unique_fact}$$,
                "current_employer"                          = '${applicant_info.current_employer}',
                "current_position_title"                    = '${applicant_info.current_position_title}',
                "current_description_of_role"               = $$${applicant_info.current_description_of_role}$$,
                "current_employment_period_start"           = '${applicant_info.current_employment_period_start}',
                "current_employment_period_end"             = '${applicant_info.current_employment_period_end}',
                "current_supervisor_reference"              = '${applicant_info.current_supervisor_reference}',
                "current_supervisor_phone_number"           = '${applicant_info.current_supervisor_phone_number}',
                "current_supervisor_country_code"           = '${applicant_info.current_supervisor_country_code}',
                "current_contact_supervisor"                = '${applicant_info.current_contact_supervisor}',
                "previous_employer"                         = '${applicant_info.previous_employer}',
                "previous_position_title"                   = '${applicant_info.previous_position_title}',
                "previous_description_of_role"              = $$${applicant_info.previous_description_of_role}$$,
                "previous_employment_period_start"          = '${applicant_info.previous_employment_period_start}',
                "previous_employment_period_end"            = '${applicant_info.previous_employment_period_end}',
                "previous_supervisor_reference"             = '${applicant_info.previous_supervisor_reference}',
                "previous_supervisor_phone_number"          = '${applicant_info.previous_supervisor_phone_number}',
                "previous_supervisor_country_code"          = '${applicant_info.previous_supervisor_country_code}',
                "previous_contact_supervisor"               = '${applicant_info.previous_contact_supervisor}',
                "school_college"                            = '${applicant_info.school_college}',
                "graduation_year"                           = '${applicant_info.graduation_year}',
                "resume"                                    = '${applicant_info.resume}',
                "employment_period"                         = '${applicant_info.employment_period}',
                "applied_job"                               = '${applicant_info.applied_job}',
                "action_required"                           = '${true}',
                "modified_at"                               = NULL               

             where email = '${email}'
             RETURNING id as employee_id
             ;
          `
            let updateEmployee = await db.query(query);
        }

        // let employee_id = updateEmployee.rows[0].employee_id

        // let employeeDocuments = `
        //             UPDATE 
        //             "Employee_Documents"
        //         SET 
        //             "category"                      = NULL,
        //             "passport_country"              = NULL,
        //             "passport_number"               = NULL,
        //             "passport_expiration_date"      = NULL,
        //             "passport_doc"                  = NULL,
        //             "passport_sign"                 = NULL,
        //             "passport_disclaimer"           = NULL,
        //             "approval_letter_date"          = NULL,
        //             "approval_letter_doc"           = NULL,
        //             "approval_letter_sign"          = NULL,
        //             "approval_letter_disclaimer"    = NULL,
        //             "contract_date"                 = NULL,
        //             "contract_doc"                  = NULL,
        //             "contract_sign"                 = NULL,
        //             "contract_disclaimer"           = NULL,
        //             "b797_number"                   = NULL,
        //             "b797_expiration_date"          = NULL,
        //             "b797_doc"                      = NULL,
        //             "b797_sign"                     = NULL,
        //             "b797_disclaimer"               = NULL,
        //             "dot_physical_name"             = NULL,
        //             "dot_physical_expiration_date"  = NULL,
        //             "dot_physical_issue_date"       = NULL,
        //             "dot_physical_doc"              = NULL,
        //             "dot_physical_sign"             = NULL,
        //             "dot_physical_disclaimer"       = NULL,
        //             "drug_test_name"                = NULL,
        //             "drug_test_expiration_date"     = NULL,
        //             "drug_test_issue_date"          = NULL,
        //             "drug_test_doc"                 = NULL,
        //             "drug_test_sign"                = NULL,
        //             "drug_test_disclaimer"          = NULL,
        //             "auto_license_state"            = NULL,
        //             "auto_license_number"           = NULL,
        //             "auto_license_expiration_date"  = NULL,
        //             "auto_license_issue_date"       = NULL,
        //             "auto_license_doc"              = NULL,
        //             "auto_license_sign"             = NULL,
        //             "auto_license_disclaimer"       = NULL,
        //             "cdl_license_state"             = NULL,
        //             "cdl_license_number"            = NULL,
        //             "cdl_license_issue_date"        = NULL,
        //             "cdl_license_doc"               = NULL,
        //             "cdl_license_sign"              = NULL,
        //             "cdl_license_disclaimer"        = NULL,
        //             "work_agreement_date"           = NULL,
        //             "work_agreement_doc"            = NULL,
        //             "work_agreement_sign"           = NULL,
        //             "work_agreement_disclaimer"     = NULL,
        //             "itinerary_date"                = NULL,
        //             "itinerary_doc"                 = NULL,
        //             "itinerary_sign"                = NULL,
        //             "itinerary_disclaimer"          = NULL,
        //             "visa_control_number"           = NULL,
        //             "visa_issue_date"               = NULL,
        //             "visa_expiration_date"          = NULL,
        //             "visa_nationality"              = NULL,
        //             "visa_red_stamped_no"           = NULL,
        //             "visa_issue_post"               = NULL,
        //             "visa_doc"                      = NULL,
        //             "visa_sign"                     = NULL,
        //             "visa_disclaimer"               = NULL,
        //             "i9_date"                       = NULL,
        //             "i9_doc"                        = NULL,
        //             "i9_sign"                       = NULL,
        //             "i9_disclaimer"                 = NULL,
        //             "i94_date"                      = NULL,
        //             "i94_doc"                       = NULL,
        //             "i94_sign"                      = NULL,
        //             "i94_disclaimer"                = NULL,
        //             "cert_arrival_date"             = NULL,
        //             "cert_first_day"                = NULL,
        //             "cert_doc"                      = NULL,
        //             "cert_sign"                     = NULL,
        //             "cert_disclaimer"               = NULL,
        //             "department_last_day"           = NULL,
        //             "department_departure_date"     = NULL,
        //             "department_doc"                = NULL,
        //             "department_sign"               = NULL,
        //             "department_disclaimer"         = NULL,
        //             "handbook_date"                 = NULL,
        //             "handbook_doc"                  = NULL,
        //             "handbook_sign"                 = NULL,
        //             "handbook_disclaimer"           = NULL,
        //             "rules_date"                    = NULL,
        //             "rules_doc"                     = NULL,
        //             "rules_sign"                    = NULL,
        //             "rules_disclaimer"              = NULL,
        //             "drug_policy_date"              = NULL,
        //             "drug_policy_doc"               = NULL,
        //             "drug_policy_sign"              = NULL,
        //             "drug_policy_disclaimer"        = NULL,
        //             "reprimand_policy_date"         = NULL,
        //             "reprimand_policy_doc"          = NULL,
        //             "reprimand_policy_sign"         = NULL,
        //             "reprimand_policy_disclaimer"   = NULL,
        //             "departure_date"                = NULL,
        //             "departure_doc"                 = NULL,
        //             "departure_sign"                = NULL,
        //             "departure_disclaimer"          = NULL,
        //             "bank_acc_name"                 = NULL,
        //             "bank_acc_routing"              = NULL,
        //             "bank_acc_account"              = NULL,
        //             "bank_acc_doc"                  = NULL,
        //             "bank_acc_sign"                 = NULL,
        //             "bank_acc_disclaimer"           = NULL,
        //             "social_sec_number"             = NULL,
        //             "social_sec_name"               = NULL,
        //             "social_sec_doc"                = NULL,
        //             "social_sec_sign"               = NULL,
        //             "social_sec_disclaimer"         = NULL,
        //             "w4_name"                       = NULL,
        //             "w4_doc"                        = NULL,
        //             "w4_sign"                       = NULL,
        //             "w4_disclaimer"                 = NULL,
        //             "w4_no_of_dependents"           = NULL,
        //             "license_type"                  = NULL,
        //             "cdl_training_date"             = NULL,
        //             "cdl_training_sign"             = NULL,
        //             "cdl_training_disclaimer"       = NULL,
        //             "foreign_driver_license_state"  = NULL,
        //             "foreign_driver_license_number" = NULL,
        //             "foreign_driver_license_issue_date" = NULL,
        //             "foreign_driver_license_doc"    = NULL,
        //             "foreign_driver_license_sign"   = NULL,
        //             "foreign_driver_license_disclaimer" = NULL,
        //             "equipment_policy_date"         = NULL,
        //             "equipment_policy_doc"          = NULL,
        //             "equipment_policy_sign"         = NULL,
        //             "equipment_policy_disclaimer"   = NULL,
        //             "american_license_state"        = NULL,
        //             "american_license_number"       = NULL,
        //             "american_license_issue_date"   = NULL,
        //             "american_license_doc"          = NULL,
        //             "american_license_sign"         = NULL,
        //             "american_license_disclaimer"   = NULL,
        //             "visa_interview_date"           = NULL,
        //             "visa_interview_embassy"        = NULL,
        //             "visa_interview_street"         = NULL,
        //             "visa_interview_city"           = NULL,
        //             "visa_interview_country"        = NULL,
        //             "visa_interview_phone_number"   = NULL,
        //             "visa_interview_sign"           = NULL,
        //             "visa_interview_disclaimer"     = NULL,
        //             "american_license_type"         = NULL,
        //             "i94_number"                    = NULL,
        //             "created_at"                    = 'now()'

        //             where employee_id = '${employee_id}';
        //             ;`

        // await db.query(employeeDocuments);

        // if (applicant_info.country == 'United States of America') {
        //     let query = `
        //             UPDATE 
        //             "Employee_Status_Bar"
        //         SET 
        //             "status_step"                            = '2',
        //             "step_one_date"                          = 'now()',
        //             "step_two_date"                          = NULL,
        //             "step_three_date"                        = NULL,
        //             "step_four_date"                         = NULL,
        //             "step_five_date"                         = NULL,
        //             "step_six_date"                          = NULL,
        //             "step_seven_date"                        = NULL,
        //             "step_eight_date"                        = NULL,
        //             "step_nine_date"                         = NULL,
        //             "step_ten_date"                          = NULL,
        //             "step_eleven_date"                       = NULL,
        //             "step_twelve_date"                       = NULL,
        //             "step_thirteen_date"                     = NULL,
        //             "step_fourteen_date"                     = NULL,
        //             "step_fifteen_date"                      = NULL,
        //             "step_sixteen_date"                      = NULL,
        //             "step_seventeen_date"                    = NULL,
        //             "step_eighteen_date"                     = NULL,
        //             "step_nineteen_date"                     = NULL,
        //             "step_twenty_date"                       = NULL,
        //             "account_activated"                      = NULL,
        //             "driver_license_ss_card"                 = NULL,
        //             "compliance_docs"                        = NULL,
        //             "contract_created"                       = NULL,
        //             "contract_w4"                            = NULL,
        //             "bank_account"                           = NULL,
        //             "additional_compliance_docs"             = NULL,
        //             "cdl_training"                           = NULL,
        //             "travel_arrangements"                    = NULL,
        //             "results"                                = NULL,
        //             "created_at"                             = 'now()',
        //             "modified_at"                            = NULL,
        //             "status_message"                         = 'Account Activated',
        //             "prev_status_message"                    = NULL

        //             where employee_id = '${employee_id}';
        //             ;`

        //     let updateEmployee = await db.query(query);

        // }

        // else if (applicant_info.country != 'United States of America') {
        //     let query = `
        //             UPDATE 
        //             "H2a_Status_Bar"
        //         SET 
        //             "status_step"                           = '2',
        //             "step_one_date"                         = 'now()',
        //             "step_two_date"                         = NULL,
        //             "step_three_date"                       = NULL,
        //             "step_four_date"                        = NULL,
        //             "step_five_date"                        = NULL,
        //             "step_six_date"                         = NULL,
        //             "step_seven_date"                       = NULL,
        //             "step_eight_date"                       = NULL,
        //             "step_nine_date"                        = NULL,
        //             "step_ten_date"                         = NULL,
        //             "step_eleven_date"                      = NULL,
        //             "step_twelve_date"                      = NULL,
        //             "step_thirteen_date"                    = NULL,
        //             "step_fourteen_date"                    = NULL,
        //             "step_fifteen_date"                     = NULL,
        //             "step_sixteen_date"                     = NULL,
        //             "step_seventeen_date"                   = NULL,
        //             "step_eighteen_date"                    = NULL,
        //             "account_activated"                     = NULL,
        //             "passport_driver_license"               = NULL,
        //             "compliance_docs"                       = NULL,
        //             "visa"                                  = NULL,
        //             "contract"                              = NULL,
        //             "bank_account"                          = NULL,
        //             "additional_compliance_docs"            = NULL,
        //             "travel_arrangements"                   = NULL,
        //             created_at                              = 'now()',
        //             "modified_at"                           = NULL,
        //             "status_message"                        = 'Account Activated',
        //             "prev_status_message"                   = NULL,
        //             "results"                               = NULL,
        //             "approval_letter"                       = NULL,
        //             "cdl_training"                          = NULL,
        //             "h2a_documents"                         = NULL,
        //             "social_security"                       = NULL,
        //             "american_license"                      = NULL,
        //             "visa_consulate_details"                = NULL,
        //             "step_nineteen_date"                    = NULL,
        //             "step_twenty_date"                      = NULL,
        //             "step_twenty_one_date"                  = NULL,
        //             "step_twenty_two_date"                  = NULL,
        //             "step_twenty_three_date"                = NULL,
        //             "step_twenty_four_date"                 = NULL,
        //             "step_twenty_five_date"                 = NULL,
        //             "onboarding_completed"                  = NULL

        //             where employee_id = '${employee_id}';
        //             ;`

        //     let updateEmployee = await db.query(query);
        // }

        let resp = {
            message: ""
        }

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
