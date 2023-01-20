import * as _ from "lodash";

let status_bar_dates = {
    "Account Activated": "step_two_date",
    "Email Sent to upload Drivers License and SS card": "step_three_date",
    "Driver License and SS card verified": "step_four_date",
    "Email sent to review/sign compliance docs": "step_five_date",
    "Compliance docs verified": "step_six_date",
    "Email Sent to notify that contract and W4 posted": "step_seven_date",
    "Contract signed by employee is verified": "step_eight_date",
    "Email sent to set-up online bank account": "step_nine_date",
    "Bank account details verified": "step_ten_date",
    "Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy": "step_eleven_date",
    "Docs verified": "step_twelve_date",
    // "Email sent to complete CDL training": "step_thirteen_date",
    // "CDL training verified": "step_fourteen_date",
    "Email sent to make travel arrangements": "step_thirteen_date",
    "Results": "step_fourteen_date",
    "Active": "step_fifteen_date",
    "Inprocess": "step_sixteen_date",
    "Inactive": "step_seventeen_date",
};
let status_bar_steps = ["Account Activated" , "Email Sent to upload Drivers License and SS card" , "Driver License and SS card verified" , "Email sent to review/sign compliance docs" ,"Compliance docs verified" , "Email Sent to notify that contract and W4 posted", "Contract signed by employee is verified",
"Email sent to set-up online bank account", "Bank account details verified" ,"Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy" , "Docs verified" , "Email sent to make travel arrangements","Results","Active","Inprocess","Inactive",]

let status_message = ["driver_license_ss_card" , "driver_license_ss_card", "compliance_docs","compliance_docs", "contract_w4", "contract_w4", "bank_account", "bank_account" , "additional_compliance_docs", "additional_compliance_docs","travel_arrangements"]

export function updateQuery(employee, email) {

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

    else {
        let query = `
        UPDATE "Employee_Status_Bar"
        SET 
        `;
        query = query + `
        "status_step" = '${employee.status_step}',
        "${status_message[employee.rejected? employee.status_step - 3 : employee.status_step - 3]}" = '${employee.status_message}',
        "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
        "prev_status_message" = '${employee.prev_status_message}',
        "${status_bar_dates[employee.prev_status_message]}" = now()`
        
         query = query + `
                WHERE "employee_id" = '${employee.id}';
        `;

        return query;
    }



}