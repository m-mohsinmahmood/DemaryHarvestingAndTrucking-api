import * as _ from "lodash";

let status_bar_dates = {
    "Account Activated": "step_two_date",
    "Admin sending email to upload DL and SS card": "step_three_date",
    "Driver License and SS card verified": "step_four_date",
    "Compliance docs posted": "step_five_date",
    "Compliance docs verified": "step_six_date",
    "Employee Contract and W4 posted": "step_seven_date",
    "Employee Contract and W4 verified": "step_eight_date",
    "Bank account information requested": "step_nine_date",
    "Bank account details verified": "step_ten_date",
    "DHT Company docs posted": "step_eleven_date",
    "DHT Company docs verified": "step_twelve_date",
    "CDL training instructions posted": "step_thirteen_date",
    "CDL training instructions verified": "step_fourteen_date",
    "Travel arrangements email": "step_fifteen_date",
    "Onboarding Completed": "step_sixteen_date",
    "Active": "step_seventeen_date",
    "Inprocess": "step_eighteen_date",
    "Inactive": "step_nineteen_date",
};

let status_bar_steps = [
    "Account Activated",
    "Admin sending email to upload DL and SS card",
    "Driver License and SS card verified",
    "Compliance docs posted",
    "Compliance docs verified",
    "Employee Contract and W4 posted",
    "Employee Contract and W4 verified",
    "Bank account information requested",
    "Bank account details verified",
    "DHT Company docs posted",
    "DHT Company docs verified",
    "CDL training instructions posted",
    "CDL training instructions verified",
    "Travel arrangements email",
    "Onboarding Completed", "Active", "Inprocess", "Inactive"
]

let status_message = [
    "driver_license_ss_card",
    "driver_license_ss_card",
    "compliance_docs",
    "compliance_docs",
    "contract_w4",
    "contract_w4",
    "bank_account",
    "bank_account",
    "additional_compliance_docs",
    "additional_compliance_docs",
    "cdl_training",
    "cdl_training",
    "travel_arrangements"
]

let h2a_status_bar_dates = {
    "Account Activated": "step_two_date",
    "Admin sending email to upload PP,DL, and SS docs": "step_three_date",
    "Passport and Drivers License verified": "step_four_date",
    "CDL training instructions posted": "step_five_date",
    "CDL training instructions verified": "step_six_date",
    "Compliance docs posted" : "step_seven_date",
    "Compliance docs verified": "step_eight_date",
    "Employee Contract posted": "step_nine_date",
    "Employee Contract verified": "step_ten_date",
    "Bank account information requested": "step_eleven_date",
    "Bank account details verified": "step_twelve_date",
    "I-797B, VISA Interview Date and Consulate Details verified": "step_thirteen_date",
    "VISA Interview Date and Consulate Details verified": "step_fourteen_date",
    "Approval Letter posted": "step_fifteen_date",
    "Approval Letter verified": "step_sixteen_date",
    "Waiting for VISA verification":"step_seventeen_date",
    "VISA is verified":"step_eighteen_date",
    "Waiting for further H2A required documentation": "step_nineteen_date",
    "Additional H2A documentation verified": "step_twenty_date",
    "Social Security Card posted": "step_twenty_one_date",
    "Social Security Card verified": "step_twenty_two_date",
    "American and CDL (if applicable) Drivers license posted": "step_twenty_three_date",
    "Drivers license verified": "step_twenty_four_date",
    "Onboarding Completed": "step_twenty_five_date",
};

let h2a_status_bar_steps = [
    "Account Activated",
    "Admin sending email to upload PP,DL, and SS docs",
    "Passport and Drivers License verified",
    "CDL training instructions posted",
    "CDL training instructions verified",
    "Compliance docs posted",
    "Compliance docs verified",
    "Employee Contract posted",
    "Employee Contract verified",
    "Bank account information requested",
    "Bank account details verified",
    "I-797B, VISA Interview Date and Consulate Details verified",
    "VISA Interview Date and Consulate Details verified",
    "Approval Letter posted",
    "Approval Letter verified",
    "Waiting for VISA verification",
    "VISA is verified",
    "Waiting for further H2A required documentation",
    "Additional H2A documentation verified",
    "Social Security Card posted",
    "Social Security Card verified",
    "American and CDL (if applicable) Drivers license posted",
    "Drivers license verified",
    "Onboarding Completed",
]

let h2a_status_message = [
    "passport_driver_license",
    "passport_driver_license",
    "cdl_training",
    "cdl_training",
    "compliance_docs",
    "compliance_docs",
    "contract",
    "contract",
    "bank_account",
    "bank_account",
    "visa_consulate_details",
    "visa_consulate_details",
    "approval_letter",
    "approval_letter",
    "visa",
    "visa",
    "h2a_documents",
    "h2a_documents",
    "social_security",
    "social_security",
    "american_license",
    "american_license",
    "onboarding_completed",
]

export function updateQuery(employee, h2a) {

    // To update Employee Role
    if (employee?.role) {
        let query = `
        UPDATE 
                "Employees"
        SET 
                "role"= '${employee.role}'
        WHERE 
                "id" = '${employee.id}';`
        return query;

    }
    else if (employee?.rate_type){
        let query = `
        UPDATE 
                "Employees"
        SET 
                "rate_type" = '${employee.rate_type}',
                "actual_rate" = '${employee.actual_rate}',
                "ag_operator" = '${employee.ag_operator}'
        WHERE 
                "id" = '${employee.id}';`
        return query;
    }
    else if (h2a == 'false') {
        let query
        query = `
            UPDATE "Employee_Status_Bar"
            SET 
        `;
        query = query + `
        "status_step" = '${employee.status_step}',
        "${status_message[employee.rejected ? employee.status_step - 3 : employee.status_step - 3]}" = '${employee.status_message}',
        "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
        "prev_status_message" = '${employee.prev_status_message}',
        "${status_bar_dates[employee.prev_status_message]}" = now()`
        query = query + `
                WHERE "employee_id" = '${employee.id}';
        `;

        query = query + 
                   `UPDATE "Employees"
                    SET
                   "action_required" = '${+employee.status_step % 2 == 0 ? true : false}'
                    WHERE "id" = '${employee.id}';
                    `;

        return query;
    }
    else if (h2a == 'true') {
        let query
        query = `
            UPDATE "H2a_Status_Bar"
            SET 
            `;
        query = query + `
        "status_step" = '${employee.status_step}',
        "${h2a_status_message[employee.rejected ? employee.status_step - 3 : employee.status_step - 3]}" = '${employee.status_message}',
        "status_message" = '${h2a_status_bar_steps[+employee.status_step - 2]}',
        "prev_status_message" = '${employee.prev_status_message}',
        "${h2a_status_bar_dates[employee.prev_status_message]}" = now()`
        query = query + `
                WHERE "employee_id" = '${employee.id}';
        `;

        query = query + 
                       `UPDATE "Employees"
                        SET
                       "action_required" = '${+employee.status_step % 2 == 0 ? true : false}'
                        WHERE "id" = '${employee.id}';
                        `;
        return query;
    }



}