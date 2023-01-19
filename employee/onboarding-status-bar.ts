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
    "Email sent to complete CDL training": "step_thirteen_date",
    "CDL training verified": "step_fourteen_date",
    "Email sent to make travel arrangements": "step_fifteen_date",
    "Results": "step_sixteen_date",
    "Active": "step_seventeen_date",
    "Inprocess": "step_eighteen_date",
    "Inactive": "step_nineteen_date",
};
let status_bar_steps = ["Account Activated" , "Email Sent to upload Drivers License and SS card" , "Driver License and SS card verified" , "Email sent to review/sign compliance docs" ,"Compliance docs verified" , "Email Sent to notify that contract and W4 posted", "Contract signed by employee is verified",
"Email sent to set-up online bank account", "Bank account details verified" ,"Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy" , "Docs verified", "Email sent to complete CDL training", "CDL training verified" , "Email sent to make travel arrangements","Results","Active","Inprocess","Inactive",]

let status_message = ["driver_license_ss_card" , "driver_license_ss_card", "compliance_docs","compliance_docs", "contract_w4", "contract_w4", "bank_account", "bank_account" , "additional_compliance_docs", "additional_compliance_docs" ,"cdl_training" , "cdl_training" , "travel_arrangements", "travel_arrangements"]

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
        "${status_message[employee.rejected? (employee.status_step + 1) - 3 : employee.status_step - 3]}" = '${employee.status_message}',
        "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
        "prev_status_message" = '${employee.prev_status_message}',
        "${status_bar_dates[employee.prev_status_message]}" = now()`

    //     switch (employee.prev_status_message) {

    //         case "Account Activated":
    //                 query = query + `
    //            "status_step" = '${employee.status_step}',
    //            '${status_message[employee.status_step - 3]}' = '${employee.status_message}',
    //            "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
    //            "prev_status_message" = '${employee.prev_status_message}',
    //            "${status_bar_dates[employee.prev_status_message]}" = now()
    //    `;
    //            break;

    //        case "Email Sent to upload Drivers License and SS card":
    //            query = query + `
    //            "status_step" = '${employee.status_step}',
    //            "driver_license_ss_card" = '${employee.status_message}',
    //            "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
    //            "prev_status_message" = '${employee.prev_status_message}',
    //            "${status_bar_dates[employee.prev_status_message]}" = now()
    //    `;
    //            break;

    //        case "Driver License and SS card verified":
    //            query = query + `
    //            "status_step" = '${employee.status_step}',
    //            "compliance_docs" = '${employee.status_message}',
    //            "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
    //            "prev_status_message" = '${employee.prev_status_message}',
    //            "${status_bar_dates[employee.prev_status_message]}" = now()
    //    `;
    //            break;

    //        case "Email sent to review/sign compliance docs":
    //            query = query + `
    //            "status_step" = '${employee.status_step}',
    //            "compliance_docs" = '${employee.status_message}',
    //            "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
    //            "prev_status_message" = '${employee.prev_status_message}',
    //            "${status_bar_dates[employee.prev_status_message]}" = now()
    //    `;
    //            break;

    //        case "Compliance docs verified":
    //            query = query + `
    //            "status_step" = '${employee.status_step}',
    //            "contract_created" = '${employee.status_message}',
    //            "status_message" = '${status_bar_steps[+employee.status_step - 2]}',
    //            "prev_status_message" = '${employee.prev_status_message}',
    //            "${status_bar_dates[employee.prev_status_message]}" = now()
    //    `;
    //            break;

    //        default:
    //            break;
    //    }

         query = query + `
                WHERE "employee_id" = '${employee.id}';
        `;

        return query;
    }



}