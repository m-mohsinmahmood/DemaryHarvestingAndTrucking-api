import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { employee_docs } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const employee_docs: employee_docs = req.body;
        let query = `
        UPDATE 
                "Employees_Documents"
        SET 
                "category"                              ='${employee_docs.category}
                "passport_country"                      ='${employee_docs.passport_country}
                "passport_number"                       ='${employee_docs.passport_number}
                "passport_expiration_date"              ='${employee_docs.passport_expiration_date}
                "passport_doc"                          ='${employee_docs.passport_doc}
                "passport_sign"                         ='${employee_docs.passport_sign}
                "approval_letter_date"                  ='${employee_docs.approval_letter_date}
                "approval_letter_doc"                   ='${employee_docs.approval_letter_doc}
                "approval_letter_sign"                  ='${employee_docs.approval_letter_sign}
                "contract_date"                         ='${employee_docs.contract_date}
                "contract_doc"                          ='${employee_docs.contract_doc}
                "contract_sign"                         ='${employee_docs.contract_sign}
                "b797_number"                             ='${employee_docs.b797_number}
                "b797_expiration_date"                  ='${employee_docs.b797_expiration_date}
                "b797_doc"                              ='${employee_docs.b797_doc}
                "b797_sign"                             ='${employee_docs.b797_sign}
                "dot_physical_name"                     ='${employee_docs.dot_physical_name}
                "dot_physical_expiration_date"          ='${employee_docs.dot_physical_expiration_date}
                "dot_physical_issue_date"               ='${employee_docs.dot_physical_issue_date}
                "dot_physical_doc"                      ='${employee_docs.dot_physical_doc}
                "dot_physical_sign"                     ='${employee_docs.dot_physical_sign}
                "drug_test_name"                        ='${employee_docs.drug_test_name}
                "drug_test_expiration_date"             ='${employee_docs.drug_test_expiration_date}
                "drug_test_issue_date"                  ='${employee_docs.drug_test_issue_date}
                "drug_test_doc"                         ='${employee_docs.drug_test_doc}
                "drug_test_sign"                        ='${employee_docs.drug_test_sign}
                "auto_license_state"                    ='${employee_docs.auto_license_state}
                "auto_license_number"                   ='${employee_docs.auto_license_number}
                "auto_license_expiration_date"          ='${employee_docs.auto_license_expiration_date}
                "auto_license_issue_date"               ='${employee_docs.auto_license_issue_date}
                "auto_license_doc"                      ='${employee_docs.auto_license_doc}
                "auto_license_sign"                     ='${employee_docs.auto_license_sign}
                "cdl_license_state"                     ='${employee_docs.cdl_license_state}
                "cdl_license_number"                    ='${employee_docs.cdl_license_number}
                "cdl_license_issue_date"                ='${employee_docs.cdl_license_issue_date}
                "cdl_license_doc"                       ='${employee_docs.cdl_license_doc}
                "cdl_license_sign"                      ='${employee_docs.cdl_license_sign}
                "work_agreement_date"                   ='${employee_docs.work_agreement_date}
                "work_agreement_doc"                    ='${employee_docs.work_agreement_doc}
                "work_agreement_sign"                   ='${employee_docs.work_agreement_sign}
                "itinerary_date"                        ='${employee_docs.itinerary_date}
                "itinerary_doc"                         ='${employee_docs.itinerary_doc}
                "itinerary_sign"                        ='${employee_docs.itinerary_sign}
                "visa_control_number"                   ='${employee_docs.visa_control_number}
                "visa_issue_date"                       ='${employee_docs.visa_issue_date}
                "visa_expiration_date"                  ='${employee_docs.visa_expiration_date}
                "visa_nationality"                      ='${employee_docs.visa_nationality}
                "visa_red_stamped_no"                   ='${employee_docs.visa_red_stamped_no}
                "visa_issue_post"                       ='${employee_docs.visa_issue_post}
                "visa_doc"                              ='${employee_docs.visa_doc}
                "visa_sign"                             ='${employee_docs.visa_sign}
                "i9_date"                               ='${employee_docs.i9_date}
                "i9_doc"                                ='${employee_docs.i9_doc}
                "i9_sign"                               ='${employee_docs.i9_sign}
                "i94_date"                              ='${employee_docs.i94_date}
                "i94_doc"                               ='${employee_docs.i94_doc}
                "i94_sign"                              ='${employee_docs.i94_sign}
                "cert_arrival_date"                     ='${employee_docs.cert_arrival_date}
                "cert_first_day"                        ='${employee_docs.cert_first_day}
                "cert_doc"                              ='${employee_docs.cert_doc}
                "cert_sign"                             ='${employee_docs.cert_sign}
                "department_last_day"                   ='${employee_docs.department_last_day}
                "department_departure_date"             ='${employee_docs.department_departure_date}
                "department_doc"                        ='${employee_docs.department_doc}
                "department_sign"                       ='${employee_docs.department_sign}
                "handbook_date"                         ='${employee_docs.handbook_date}
                "handbook_doc"                          ='${employee_docs.handbook_doc}
                "handbook_sign"                         ='${employee_docs.handbook_sign}
                "rules_date"                            ='${employee_docs.rules_date}
                "rules_doc"                             ='${employee_docs.rules_doc}
                "rules_sign"                            ='${employee_docs.rules_sign}
                "drug_policy_date"                      ='${employee_docs.drug_policy_date}
                "drug_policy_doc"                       ='${employee_docs.drug_policy_doc}
                "drug_policy_sign"                      ='${employee_docs.drug_policy_sign}
                "reprimand_policy_date"                 ='${employee_docs.reprimand_policy_date}
                "reprimand_policy_doc"                  ='${employee_docs.reprimand_policy_doc}
                "reprimand_policy_sign"                 ='${employee_docs.reprimand_policy_sign}
                "deptarture_date"                       ='${employee_docs.departure_date}
                "deptarture_doc"                        ='${employee_docs.departure_doc}
                "deptarture_sign"                       ='${employee_docs.departure_sign}
                "bank_acc_name"                         ='${employee_docs.bank_acc_name}
                "bank_acc_routing"                      ='${employee_docs.bank_acc_routing}
                "bank_acc_account"                      ='${employee_docs.bank_acc_account}
                "bank_acc_doc"                          ='${employee_docs.bank_acc_doc}
                "bank_acc_sign"                         ='${employee_docs.bank_acc_sign}
                "social_sec_number"                     ='${employee_docs.social_sec_number}
                "social_sec_name"                       ='${employee_docs.social_sec_name}
                "social_sec_doc"                        ='${employee_docs.social_sec_doc}
                "social_sec_sign"                       ='${employee_docs.social_sec_sign}
                "w4_name"                               ='${employee_docs.w4_name}
                "w4_doc"                                ='${employee_docs.w4_doc}
                "w4_sign"                               ='${employee_docs.w4_sign}
                "modified_at"                           ='now()'
             
        WHERE 
                "id" = '${employee_docs.id}';`

        db.connect();
        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Employee Doc has been updated successfully.",
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
