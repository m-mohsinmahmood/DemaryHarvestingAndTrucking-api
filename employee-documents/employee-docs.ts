import * as _ from "lodash";


let documents = {
  passport: {
    "field1": "passport_country",
    "field2": "passport_number",
    "field3": "passport_expiration_date",
    "field4": "passport_doc",
    "field5": "passport_sign",
    "field6": "passport_disclaimer",
  },
  approval_letter: {
    "field1": "approval_letter_date",
    "field2": "approval_letter_doc",
    "field3": "approval_letter_sign",
    "field4": "approval_letter_disclaimer",
  },
  contract: {
    "field1": "contract_date",
    "field2": "contract_doc",
    "field3": "contract_sign",
    "field4": "contract_disclaimer",
  },
  b797: {
    "field1": "b797_date",
    "field2": "b797_expiration_date",
    "field3": "b797_doc",
    "field4": "b797_sign",
    "field5": "b797_disclaimer",

  },
  dot_physical: {
    "field1": "dot_physical_name",
    "field2": "dot_physical_expiration_date",
    "field3": "dot_physical_issue_date",
    "field4": "dot_physical_doc",
    "field5": "dot_physical_sign",
    "field6": "dot_physical_disclaimer",

  },
  drug_test: {
    "field1": "drug_test_name",
    "field2": "drug_test_expiration_date",
    "field3": "drug_test_issue_date",
    "field4": "drug_test_doc",
    "field5": "drug_test_sign",
    "field6": "drug_test_disclaimer",
  },
  auto_license: {
    "field1": "auto_license_state",
    "field2": "auto_license_number",
    "field3": "auto_license_expiration_date",
    "field4": "auto_license_issue_date",
    "field5": "auto_license_doc",
    "field6": "auto_license_sign",
    "field7": "auto_license_disclaimer",

  },
  cdl_license: {
    "field1": "cdl_license_state",
    "field2": "cdl_license_number",
    "field3": "cdl_license_issue_date",
    "field4": "cdl_license_doc",
    "field5": "cdl_license_sign",
    "field6": "cdl_license_disclaimer",
  },
  work_agreement: {
    "field1": "work_agreement_date",
    "field2": "work_agreement_doc",
    "field3": "work_agreement_sign",
    "field4": "work_agreement_disclaimer",
  },
  itinerary: {
    "field1": "itinerary_date",
    "field2": "itinerary_doc",
    "field3": "itinerary_sign",
    "field4": "itinerary_disclaimer",

  },
  visa: {
    "field1": "visa_control_number",
    "field2": "visa_issue_date",
    "field3": "visa_expiration_date",
    "field4": "visa_nationality",
    "field5": "visa_red_stamped_no",
    "field6": "visa_issue_post",
    "field7": "visa_doc",
    "field8": "visa_sign",
    "field9": "visa_disclaimer",

  },
  i9: {
    "field1": "i9_date",
    "field2": "i9_doc",
    "field3": "i9_sign",
    "field4": "i9_disclaimer"

  },
  i94: {
    "field1": "i94_date",
    "field2": "i94_doc",
    "field3": "i94_sign",
    "field4": "i94_disclaimer",

  },
  cert: {
    "field1": "cert_arrival_date",
    "field2": "cert_first_day",
    "field3": "cert_doc",
    "field4": "cert_sign",
    "field5": "cert_disclaimer",
  },
  department: {
    "field1": "department_last_day",
    "field2": "department_departure_date",
    "field3": "department_doc",
    "field4": "department_sign",
    "field5": "department_disclaimer"
  },
  handbook: {
    "field1": "handbook_date",
    "field2": "handbook_doc",
    "field3": "handbook_sign",
    "field4": "handbook_disclaimer",

  },
  rules: {
    "field1": "rules_date",
    "field2": "rules_doc",
    "field3": "rules_sign",
    "field4": "rules_disclaimer",

  },
  drug_policy: {
    "field1": "drug_policy_date",
    "field2": "drug_policy_doc",
    "field3": "drug_policy_sign",
    "field4": "drug_policy_disclaimer",

  },
  reprimand_policy: {
    "field1": "reprimand_policy_date",
    "field2": "reprimand_policy_doc",
    "field3": "reprimand_policy_sign",
    "field4": "reprimand_policy_disclaimer",

  },
  departure: {
    "field1": "departure_date",
    "field2": "departure_doc",
    "field3": "departure_sign",
    "field4": "departure_disclaimer",

  },
  bank_acc: {
    "field1": "bank_acc_name",
    "field2": "bank_acc_routing",
    "field3": "bank_acc_account",
    "field4": "bank_acc_doc",
    "field5": "bank_acc_sign",
    "field6": "bank_acc_disclaimer",

  },
  social_sec: {
    "field1": "social_sec_number",
    "field2": "social_sec_name",
    "field3": "social_sec_doc",
    "field4": "social_sec_sign",
    "field5": "social_sec_disclaimer",

  },
  w4: {
    "field1": "w4_name",
    "field2": "w4_doc",
    "field3": "w4_sign",
    "field4": "w4_disclaimer",

  },
}

export function updateQuery(employee_doc,doc_status, employee_id, docName) {
  let query = `
            UPDATE "Employee_Documents"
            SET 
          `;
  if (doc_status == 'Reject') {
    switch (docName) {
      case "driver_license_ss_card":
        query = query + `
        "${documents['cdl_license'].field1}" = '',
        "${documents['cdl_license'].field2}" = '',
        "${documents['cdl_license'].field3}" = '',
        "${documents['cdl_license'].field4}" = '',
        "${documents['cdl_license'].field5}" = '',
        "${documents['cdl_license'].field6}" = false,

        "${documents['social_sec'].field1}" = '',
        "${documents['social_sec'].field2}" = '',
        "${documents['social_sec'].field3}" = '',
        "${documents['social_sec'].field4}" = '',
        "${documents['social_sec'].field5}" = false

        `;
        break;
      case "compliance_docs":
        query = query + `
        "${documents['handbook'].field1}" = '',
        "${documents['handbook'].field2}" = '',
        "${documents['handbook'].field3}" = '',
        "${documents['handbook'].field4}" = false,

        "${documents['rules'].field1}" = '',
        "${documents['rules'].field2}" = '',
        "${documents['rules'].field3}" = '',
        "${documents['rules'].field4}" = false,

        "${documents['work_agreement'].field1}" = '',
        "${documents['work_agreement'].field2}" = '',
        "${documents['work_agreement'].field3}" = '',
        "${documents['work_agreement'].field4}" = false,

        "${documents['itinerary'].field1}" = '',
        "${documents['itinerary'].field2}" = '',
        "${documents['itinerary'].field3}" = '',
        "${documents['itinerary'].field4}" = false
          `;
        break;
      case "contract_w4":
        query = query + `
        "${documents['contract'].field1}" = '',
        "${documents['contract'].field2}" = '',
        "${documents['contract'].field3}" = '',
        "${documents['contract'].field4}" = false,

        "${documents['w4'].field1}" = '',
        "${documents['w4'].field2}" = '',
        "${documents['w4'].field3}" = '',
        "${documents['w4'].field4}" = false
        `;
        break;
      case "bank_account":
        query = query + `
        "${documents['bank_acc'].field1}" = '',
        "${documents['bank_acc'].field2}" = '',
        "${documents['bank_acc'].field3}" = '',
        "${documents['bank_acc'].field4}" = '',
        "${documents['bank_acc'].field5}" = '',
        "${documents['bank_acc'].field6}" = false
        
        `;
        break;
      case "additional_compliance_docs":
        query = query + `
        "${documents['drug_policy'].field1}" = '',
        "${documents['drug_policy'].field2}" = '',
        "${documents['drug_policy'].field3}" = '',
        "${documents['drug_policy'].field4}" = false,

        "${documents['reprimand_policy'].field1}" = '',
        "${documents['reprimand_policy'].field2}" = '',
        "${documents['reprimand_policy'].field3}" = '',
        "${documents['reprimand_policy'].field4}" = false
      
        `;
        break;
      case "cdl_training":
        query = query + `
        `;

      default:
        break;
    }

  }
  else {
    switch (docName) {
      case "passport_doc":
        query = query + `
        "${documents['passport'].field1}" = '${employee_doc.passport_country}',
        "${documents['passport'].field2}" = '${employee_doc.passport_number}',
        "${documents['passport'].field3}" = '${employee_doc.passport_expiration_date}',
        "${documents['passport'].field4}" = '',
        "${documents['passport'].field5}" = '${employee_doc.passport_sign}',
        "${documents['passport'].field6}" = '${employee_doc.passport_disclaimer}'

        `;
        break;

      case "approval_letter_doc":
        query = query + `
        "${documents['approval_letter'].field1}" = '${employee_doc.approval_letter_date}',
        "${documents['approval_letter'].field2}" = '',
        "${documents['approval_letter'].field3}" = '${employee_doc.approval_letter_sign}',
        "${documents['approval_letter'].field4}" = '${employee_doc.approval_letter_disclaimer}'

        `;
        break;

      case "contract_doc":
        query = query + `
        "${documents['contract'].field1}" = '${employee_doc.contract_date}',
        "${documents['contract'].field2}" = '',
        "${documents['contract'].field3}" = '${employee_doc.contract_sign}',
        "${documents['contract'].field4}" = '${employee_doc.contract_disclaimer}'

        `;
        break;

      case "b797_doc":
        query = query + `
        "${documents['b797'].field1}" = '${employee_doc.b797_date}',
        "${documents['b797'].field2}" = '${employee_doc.b797_expiration_date}',
        "${documents['b797'].field3}" = '',
        "${documents['b797'].field4}" = '${employee_doc.b797_sign}',
        "${documents['b797'].field5}" = '${employee_doc.b797_disclaimer}'

        `;
        break;

      case "dot_physical_doc":
        query = query + `
        "${documents['dot_physical'].field1}" = '${employee_doc.dot_physical_name}',
        "${documents['dot_physical'].field2}" = '${employee_doc.dot_physical_expiration_date}',
        "${documents['dot_physical'].field3}" = '${employee_doc.dot_physical_issue_date}',
        "${documents['dot_physical'].field4}" = '',
        "${documents['dot_physical'].field5}" = '${employee_doc.dot_physical_sign}',
        "${documents['dot_physical'].field6}" = '${employee_doc.dot_physical_disclaimer}'

        `;
        break;

      case "drug_test_doc":
        query = query + `
        "${documents['drug_test'].field1}" = '${employee_doc.drug_test_name}',
        "${documents['drug_test'].field2}" = '${employee_doc.drug_test_expiration_date}',
        "${documents['drug_test'].field3}" = '${employee_doc.drug_test_issue_date}',
        "${documents['drug_test'].field4}" = '',
        "${documents['drug_test'].field5}" = '${employee_doc.drug_test_sign}',
        "${documents['drug_test'].field6}" = '${employee_doc.drug_test_disclaimer}'

        `;
        break;

      case "auto_license_doc":
        query = query + `
        "${documents['auto_license'].field1}" = '${employee_doc.auto_license_state}',
        "${documents['auto_license'].field2}" = '${employee_doc.auto_license_number}',
        "${documents['auto_license'].field3}" = '${employee_doc.auto_license_expiration_date}',
        "${documents['auto_license'].field4}" = '${employee_doc.auto_license_issue_date}',
        "${documents['auto_license'].field5}" = '',
        "${documents['auto_license'].field6}" = '${employee_doc.auto_license_sign}',
        "${documents['auto_license'].field7}" = '${employee_doc.auto_license_disclaimer}'

        `;
        break;

      case "cdl_license_doc":
        query = query + `
        "${documents['cdl_license'].field1}" = '${employee_doc.cdl_license_state}',
        "${documents['cdl_license'].field2}" = '${employee_doc.cdl_license_number}',
        "${documents['cdl_license'].field3}" = '${employee_doc.cdl_license_issue_date}',
        "${documents['cdl_license'].field4}" = '',
        "${documents['cdl_license'].field5}" = '${employee_doc.cdl_license_sign}',
        "${documents['cdl_license'].field6}" = '${employee_doc.cdl_license_disclaimer}'

        `;
        break;

      case "work_agreement_doc":
        query = query + `
        "${documents['work_agreement'].field1}" = '${employee_doc.work_agreement_date}',
        "${documents['work_agreement'].field2}" = '',
        "${documents['work_agreement'].field3}" = '${employee_doc.work_agreement_sign}',
        "${documents['work_agreement'].field4}" = '${employee_doc.work_agreement_disclaimer}'

        `;
        break;

      case "itinerary_doc":
        query = query + `
        "${documents['itinerary'].field1}" = '${employee_doc.itinerary_date}',
        "${documents['itinerary'].field2}" = '',
        "${documents['itinerary'].field3}" = '${employee_doc.itinerary_sign}',
        "${documents['itinerary'].field4}" = '${employee_doc.itinerary_disclaimer}'

        
        `;
        break;

      case "visa_doc":
        query = query + `
        "${documents['visa'].field1}" = '${employee_doc.visa_control_number}',
        "${documents['visa'].field2}" = '${employee_doc.visa_issue_date}',
        "${documents['visa'].field3}" = '${employee_doc.visa_expiration_date}',
        "${documents['visa'].field4}" = '${employee_doc.visa_nationality}',
        "${documents['visa'].field5}" = '${employee_doc.visa_red_stamped_no}',
        "${documents['visa'].field6}" = '${employee_doc.visa_issue_post}',
        "${documents['visa'].field7}" = '',
        "${documents['visa'].field8}" = '${employee_doc.visa_sign}',
        "${documents['visa'].field9}" = '${employee_doc.visa_disclaimer}'

        `;
        break;

      case "i9_doc":
        query = query + `
        "${documents['i9'].field1}" = '${employee_doc.i9_date}',
        "${documents['i9'].field2}" = '',
        "${documents['i9'].field3}" = '${employee_doc.i9_sign}',
        "${documents['i9'].field4}" = '${employee_doc.i9_disclaimer}'

        `;
        break;

      case "i94_doc":
        query = query + `
        "${documents['i94'].field1}" = '${employee_doc.i94_date}',
        "${documents['i94'].field2}" = '',
        "${documents['i94'].field3}" = '${employee_doc.i94_sign}',
        "${documents['i94'].field4}" = '${employee_doc.i94_disclaimer}'

        `;
        break;

      case "cert_doc":
        query = query + `
        "${documents['cert'].field1}" = '${employee_doc.cert_arrival_date}',
        "${documents['cert'].field2}" = '${employee_doc.cert_first_day}',
        "${documents['cert'].field3}" = '',
        "${documents['cert'].field4}" = '${employee_doc.cert_sign}',
        "${documents['cert'].field5}" = '${employee_doc.cert_disclaimer}'

        `;
        break;

      case "department_doc":
        query = query + `
        "${documents['department'].field1}" = '${employee_doc.department_last_day}',
        "${documents['department'].field2}" = '${employee_doc.department_departure_date}',
        "${documents['department'].field3}" = '',
        "${documents['department'].field4}" = '${employee_doc.department_sign}',
        "${documents['department'].field5}" = '${employee_doc.department_disclaimer}'

        `;
        break;

      case "handbook_doc":
        query = query + `
        "${documents['handbook'].field1}" = '${employee_doc.handbook_date}',
        "${documents['handbook'].field2}" = '',
        "${documents['handbook'].field3}" = '${employee_doc.handbook_sign}',
        "${documents['handbook'].field4}" = '${employee_doc.handbook_disclaimer}'

        `;
        break;

      case "rules_doc":
        query = query + `
        "${documents['rules'].field1}" = '${employee_doc.rules_date}',
        "${documents['rules'].field2}" = '',
        "${documents['rules'].field3}" = '${employee_doc.rules_sign}',
        "${documents['rules'].field4}" = '${employee_doc.rules_disclaimer}'

        `;
        break;

      case "drug_policy_doc":
        query = query + `
        "${documents['drug_policy'].field1}" = '${employee_doc.drug_policy_date}',
        "${documents['drug_policy'].field2}" = '',
        "${documents['drug_policy'].field3}" = '${employee_doc.drug_policy_sign}',
        "${documents['drug_policy'].field4}" = '${employee_doc.drug_policy_disclaimer}'

        `;
        break;

      case "reprimand_policy_doc":
        query = query + `
        "${documents['reprimand_policy'].field1}" = '${employee_doc.reprimand_policy_date}',
        "${documents['reprimand_policy'].field2}" = '',
        "${documents['reprimand_policy'].field3}" = '${employee_doc.reprimand_policy_sign}',
        "${documents['reprimand_policy'].field4}" = '${employee_doc.reprimand_policy_disclaimer}'

        `;
        break;

      case "departure_doc":
        query = query + `
        "${documents['departure'].field1}" = '${employee_doc.departure_date}',
        "${documents['departure'].field2}" = '',
        "${documents['departure'].field3}" = '${employee_doc.departure_sign}',
        "${documents['departure'].field4}" = '${employee_doc.departure_disclaimer}'

        `;
        break;

      case "bank_acc_doc":
        query = query + `
        "${documents['bank_acc'].field1}" = '${employee_doc.bank_acc_name}',
        "${documents['bank_acc'].field2}" = '${employee_doc.bank_acc_routing}',
        "${documents['bank_acc'].field3}" = '${employee_doc.bank_acc_account}',
        "${documents['bank_acc'].field4}" = '',
        "${documents['bank_acc'].field5}" = '${employee_doc.bank_acc_sign}',
        "${documents['bank_acc'].field6}" = '${employee_doc.bank_acc_disclaimer}'

        `;
        break;
      case "social_sec_doc":
        query = query + `
        "${documents['social_sec'].field1}" = '${employee_doc.social_sec_number}',
        "${documents['social_sec'].field2}" = '${employee_doc.social_sec_name}',
        "${documents['social_sec'].field3}" = '',
        "${documents['social_sec'].field4}" = '${employee_doc.social_sec_sign}',
        "${documents['social_sec'].field5}" = '${employee_doc.social_sec_disclaimer}'

        `;
        break;

      case "w4_doc":
        query = query + `
        "${documents['w4'].field1}" = '${employee_doc.w4_name}',
        "${documents['w4'].field2}" = '',
        "${documents['w4'].field3}" = '${employee_doc.w4_sign}',
        "${documents['w4'].field4}" = '${employee_doc.w4_disclaimer}'

        `;
        break;

      default:
        break;
    }
  }


  query = query + `
      WHERE "employee_id" = '${employee_id}';
    `;

  return query;
}