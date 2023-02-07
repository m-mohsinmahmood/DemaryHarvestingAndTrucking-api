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
    "Email Sent to upload Passport and Drivers License": "step_three_date",
    "Passport and Drivers License verified": "step_four_date",
    "Compliance docs posted": "step_five_date",
    "Compliance docs verified": "step_six_date",
    "Email Sent to notify that contract posted" : "step_seven_date",
    "Employee Contract and W4 verified": "step_eight_date",
    "Bank account information requested": "step_nine_date",
    "Bank account details verified": "step_ten_date",
    "Email Sent to review/complete VISA application": "step_eleven_date",
    "Visa is verified": "step_twelve_date",
    "Email sent to notify that DHT Approval Letter posted": "step_thirteen_date",
    "Approval Letter verified": "step_fourteen_date",
    "Email sent to complete signing and dating of some additional compliance docs": "step_fifteen_date",
    "Additional compliance docs verified": "step_sixteen_date",
    "CDL training instructions posted":"step_seventeen_date",
    "CDL training instructions verified":"step_eighteen_date",
    "Travel arrangements email": "step_nineteen_date",
    "Onboarding Completed": "step_twenty_date",
    "Active": "step_twentyone_date",
    "Inprocess": "step_twentytwo_date",
    "Inactive": "step_twentythree_date",
};

let h2a_status_bar_steps = [
    "Account Activated",
    "Email Sent to upload Passport and Drivers License",
    "Passport and Drivers License verified",
    "Compliance docs posted",
    "Compliance docs verified",
    "Email Sent to notify that contract posted" ,
    "Employee Contract and W4 verified",
    "Bank account information requested",
    "Bank account details verified",
    "Email Sent to review/complete VISA application",
    "Visa is verified",
    "Email sent to notify that DHT Approval Letter posted",
    "Approval Letter verified",
    "Email sent to complete signing and dating of some additional compliance docs",
    "Additional compliance docs verified",
    "CDL training instructions posted",
    "CDL training instructions verified",
    "Travel arrangements email",
    "Onboarding Completed",
    "Active",
    "Inprocess",
    "Inactive",
]

let h2a_status_message = [
    "passport_driver_license",
    "passport_driver_license",
    "compliance_docs",
    "compliance_docs",
    "contract",
    "contract",
    "bank_account",
    "bank_account",
    "visa",
    "visa",
    "approval_letter",
    "approval_letter",
    "additional_compliance_docs",
    "additional_compliance_docs",
    "cdl_training",
    "cdl_training",
    "travel_arrangements"
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

        return query;
    }
    else {
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

        return query;
    }



}