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
    "field1": "b797_number",
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
    "field7": "license_type",

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
    "field3": "i94_number",
    "field4": "i94_sign",
    "field5": "i94_disclaimer",

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

  equipment_policy: {
    "field1": "equipment_policy_date",
    "field2": "equipment_policy_doc",
    "field3": "equipment_policy_sign",
    "field4": "equipment_policy_disclaimer",
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
    "field5": "w4_no_of_dependents",
  },
  cdl_training: {
    "field1": "cdl_training_date",
    "field2": "cdl_training_sign",
    "field3": "cdl_training_disclaimer",
  },
  foreign_driver_license: {
    "field1": "foreign_driver_license_state",
    "field2": "foreign_driver_license_number",
    "field3": "foreign_driver_license_issue_date",
    "field4": "foreign_driver_license_doc",
    "field5": "foreign_driver_license_sign",
    "field6": "foreign_driver_license_disclaimer"
  },
  american_license: {
    "field1": "american_license_state",
    "field2": "american_license_number",
    "field3": "american_license_issue_date",
    "field4": "american_license_doc",
    "field5": "american_license_sign",
    "field6": "american_license_type",
    "field7": "american_license_disclaimer"
  },
  visa_interview: {
    "field1": "visa_interview_date",
    "field2": "visa_interview_embassy",
    "field3": "visa_interview_street",
    "field4": "visa_interview_city",
    "field5": "visa_interview_country",
    "field6": "visa_interview_phone_number",
    "field7": "visa_interview_sign",
    "field8": "visa_interview_disclaimer"
  }
}

export function updateQuery(employee_doc, doc_status, employee_id, docName) {
  let query = `
            UPDATE "Employee_Documents"
            SET 
          `;
  if (doc_status == 'Reject') {
    switch (docName) {
      case "american_license":
        query = query + `
        "${documents['american_license'].field1}" = '',
        "${documents['american_license'].field2}" = '',
        "${documents['american_license'].field3}" = '',
        "${documents['american_license'].field4}" = '',
        "${documents['american_license'].field5}" = '',
        "${documents['american_license'].field6}" = '',
        "${documents['american_license'].field7}" = false
        `;
        break;
      case "visa_consulate_details":
        query = query + `
        "${documents['visa_interview'].field1}" = '',
        "${documents['visa_interview'].field2}" = '',
        "${documents['visa_interview'].field3}" = '',
        "${documents['visa_interview'].field4}" = '',
        "${documents['visa_interview'].field5}" = '',
        "${documents['visa_interview'].field6}" = '',
        "${documents['visa_interview'].field7}" = '',
        "${documents['visa_interview'].field8}" = false,

        "${documents['b797'].field1}" = '',
        "${documents['b797'].field2}" = '',
        "${documents['b797'].field3}" = '',
        "${documents['b797'].field4}" = '',
        "${documents['b797'].field5}" = false
        `;
        break;
      case "driver_license_ss_card":
        query = query + `
        "${documents['cdl_license'].field1}" = '',
        "${documents['cdl_license'].field2}" = '',
        "${documents['cdl_license'].field3}" = '',
        "${documents['cdl_license'].field4}" = '',
        "${documents['cdl_license'].field5}" = '',
        "${documents['cdl_license'].field6}" = false,
        "${documents['cdl_license'].field7}" = '',


        "${documents['social_sec'].field1}" = '',
        "${documents['social_sec'].field2}" = '',
        "${documents['social_sec'].field3}" = '',
        "${documents['social_sec'].field4}" = '',
        "${documents['social_sec'].field5}" = false

        `;
        break;
      case "passport_driver_license":
        query = query + `
        "${documents['foreign_driver_license'].field1}" = '',
        "${documents['foreign_driver_license'].field2}" = '',
        "${documents['foreign_driver_license'].field3}" = '',
        "${documents['foreign_driver_license'].field4}" = '',
        "${documents['foreign_driver_license'].field5}" = '',
        "${documents['foreign_driver_license'].field6}" = false,

        "${documents['passport'].field1}" = '',
        "${documents['passport'].field2}" = '',
        "${documents['passport'].field3}" = '',
        "${documents['passport'].field4}" = '',
        "${documents['passport'].field5}" = '',
        "${documents['passport'].field6}" = false

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
        "${documents['itinerary'].field4}" = false,

        "${documents['drug_policy'].field1}" = '',
        "${documents['drug_policy'].field2}" = '',
        "${documents['drug_policy'].field3}" = '',
        "${documents['drug_policy'].field4}" = false,

        "${documents['reprimand_policy'].field1}" = '',
        "${documents['reprimand_policy'].field2}" = '',
        "${documents['reprimand_policy'].field3}" = '',
        "${documents['reprimand_policy'].field4}" = false,

        "${documents['equipment_policy'].field1}" = '',
        "${documents['equipment_policy'].field2}" = '',
        "${documents['equipment_policy'].field3}" = '',
        "${documents['equipment_policy'].field4}" = false,

        "${documents['departure'].field1}" = '',
        "${documents['departure'].field2}" = '',
        "${documents['departure'].field3}" = '',
        "${documents['departure'].field4}" = false
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
        "${documents['w4'].field4}" = false,
        "${documents['w4'].field5}" = ''

        `;
        break;
      case "contract":
        query = query + `
          "${documents['contract'].field1}" = '',
          "${documents['contract'].field2}" = '',
          "${documents['contract'].field3}" = '',
          "${documents['contract'].field4}" = false
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
        "${documents['reprimand_policy'].field4}" = false,

        "${documents['equipment_policy'].field1}" = '',
        "${documents['equipment_policy'].field2}" = '',
        "${documents['equipment_policy'].field3}" = '',
        "${documents['equipment_policy'].field4}" = false,

        "${documents['departure'].field1}" = '',
        "${documents['departure'].field2}" = '',
        "${documents['departure'].field3}" = '',
        "${documents['departure'].field4}" = false

        `;
        break;
      case "cdl_training":
        query = query + `
        "${documents['cdl_training'].field1}" = '',
        "${documents['cdl_training'].field2}" = '',
        "${documents['cdl_training'].field3}" = false
        `;
        break;
      case "approval_letter":
        query = query + `
          "${documents['approval_letter'].field1}" = '',
          "${documents['approval_letter'].field2}" = '',
          "${documents['approval_letter'].field3}" = '',
          "${documents['approval_letter'].field4}" = false

          `;
        break;
      case "visa":
        query = query + `
          "${documents['visa'].field1}" = '',
          "${documents['visa'].field2}" = '',
          "${documents['visa'].field3}" = '',
          "${documents['visa'].field4}" = '',
          "${documents['visa'].field5}" = '',
          "${documents['visa'].field6}" = '',
          "${documents['visa'].field7}" = '',
          "${documents['visa'].field8}" = '',
          "${documents['visa'].field9}" = false
          `;
        break;
      case "h2a_documents":
        query = query + `
          "${documents['i9'].field1}" = '',
          "${documents['i9'].field2}" = '',
          "${documents['i9'].field3}" = '',
          "${documents['i9'].field4}" = false,

          "${documents['i94'].field1}" = '',
          "${documents['i94'].field2}" = '',
          "${documents['i94'].field3}" = '',
          "${documents['i94'].field4}" = false,

          "${documents['cert'].field1}" = '',
          "${documents['cert'].field2}" = '',
          "${documents['cert'].field3}" = '',
          "${documents['cert'].field4}" = '',
          "${documents['cert'].field5}" = false,

          "${documents['dot_physical'].field1}" = '',
          "${documents['dot_physical'].field2}" = '',
          "${documents['dot_physical'].field3}" = '',
          "${documents['dot_physical'].field4}" = '',
          "${documents['dot_physical'].field5}" = '',
          "${documents['dot_physical'].field6}" = false,

          "${documents['drug_test'].field1}" = '',
          "${documents['drug_test'].field2}" = '',
          "${documents['drug_test'].field3}" = '',
          "${documents['drug_test'].field4}" = '',
          "${documents['drug_test'].field5}" = '',
          "${documents['drug_test'].field6}" = false

            `;
        break;


      case "social_security":
        query = query + `
          "${documents['social_sec'].field1}" = '',
          "${documents['social_sec'].field2}" = '',
          "${documents['social_sec'].field3}" = '',
          "${documents['social_sec'].field4}" = '',
          "${documents['social_sec'].field5}" = false
            `;
        break;
      default:
        break;
    }

  }
  else {
    switch (docName) {

      case "american_license_doc":
        query = query + `
        "${documents['american_license'].field1}" = $$${employee_doc.american_license_state}$$,
        "${documents['american_license'].field2}" = $$${employee_doc.american_license_number}$$,
        "${documents['american_license'].field3}" = $$${employee_doc.american_license_issue_date}$$ :: date,
        "${documents['american_license'].field4}" = $$${employee_doc.american_license_doc}$$,
        "${documents['american_license'].field5}" = $$${employee_doc.american_license_sign}$$,
        "${documents['american_license'].field6}" = $$${employee_doc.american_license_type}$$,
        "${documents['american_license'].field7}" = $$${employee_doc.american_license_disclaimer}$$
        `;
        break;

      case "visa_interview_doc":
        if (employee_doc.visa_interview_date)
          query = query + `"${documents['visa_interview'].field1}" = $$${employee_doc.visa_interview_date}$$ :: date,`
        else
          query = query + `"${documents['visa_interview'].field1}" = 'Interview Waived Off' :: varchar,`

        query = query + `
        "${documents['visa_interview'].field2}" = $$${employee_doc.visa_interview_embassy}$$,
        "${documents['visa_interview'].field3}" = $$${employee_doc.visa_interview_street}$$,
        "${documents['visa_interview'].field4}" = $$${employee_doc.visa_interview_city}$$,
        "${documents['visa_interview'].field5}" = $$${employee_doc.visa_interview_country}$$,
        "${documents['visa_interview'].field6}" = $$${employee_doc.visa_interview_phone_number}$$,
        "${documents['visa_interview'].field7}" = $$${employee_doc.visa_interview_sign}$$,
        "${documents['visa_interview'].field8}" = $$${employee_doc.visa_interview_disclaimer}$$
        `;
        break;


      case "passport_doc":
        query = query + `
        "${documents['passport'].field1}" = '${employee_doc.passport_country}',
        "${documents['passport'].field2}" = '${employee_doc.passport_number}',
        "${documents['passport'].field3}" = '${employee_doc.passport_expiration_date}' ::date,
        "${documents['passport'].field4}" = '',
        "${documents['passport'].field5}" = $$${employee_doc.passport_sign}$$,
        "${documents['passport'].field6}" = '${employee_doc.passport_disclaimer}'

        `;
        break;

      case "foreign_driver_license_doc":
        query = query + `
          "${documents['foreign_driver_license'].field1}" = $$${employee_doc.foreign_driver_license_state}$$,
          "${documents['foreign_driver_license'].field2}" = '${employee_doc.foreign_driver_license_number}',
          "${documents['foreign_driver_license'].field3}" = '${employee_doc.foreign_driver_license_issue_date}'::date,
          "${documents['foreign_driver_license'].field4}" = '',
          "${documents['foreign_driver_license'].field5}" = $$${employee_doc.foreign_driver_license_sign}$$,
          "${documents['foreign_driver_license'].field6}" = '${employee_doc.foreign_driver_license_disclaimer}'
          `;
        break;

      case "approval_letter_doc":
        query = query + `
        "${documents['approval_letter'].field1}" = '${employee_doc.approval_letter_date}'::date,
        "${documents['approval_letter'].field2}" = '',
        "${documents['approval_letter'].field3}" = $$${employee_doc.approval_letter_sign}$$,
        "${documents['approval_letter'].field4}" = '${employee_doc.approval_letter_disclaimer}'

        `;
        break;

      case "contract_doc":
        query = query + `
        "${documents['contract'].field1}" = '${employee_doc.contract_date}' :: date,
        "${documents['contract'].field2}" = '',
        "${documents['contract'].field3}" = $$${employee_doc.contract_sign}$$,
        "${documents['contract'].field4}" = '${employee_doc.contract_disclaimer}'

        `;
        break;

      case "b797_doc":
        query = query + `
        "${documents['b797'].field1}" = '${employee_doc.b797_number}',
        "${documents['b797'].field2}" = '${employee_doc.b797_expiration_date}' :: date,
        "${documents['b797'].field3}" = '',
        "${documents['b797'].field4}" = $$${employee_doc.b797_sign}$$,
        "${documents['b797'].field5}" = '${employee_doc.b797_disclaimer}'

        `;
        break;

      case "dot_physical_doc":
        query = query + `
        "${documents['dot_physical'].field1}" = $$${employee_doc.dot_physical_name}$$,
        "${documents['dot_physical'].field2}" = '${employee_doc.dot_physical_expiration_date}' :: date,
        "${documents['dot_physical'].field3}" = '${employee_doc.dot_physical_issue_date}' :: date,
        "${documents['dot_physical'].field4}" = '',
        "${documents['dot_physical'].field5}" = $$${employee_doc.dot_physical_sign}$$,
        "${documents['dot_physical'].field6}" = '${employee_doc.dot_physical_disclaimer}'

        `;
        break;

      case "drug_test_doc":
        query = query + `
        "${documents['drug_test'].field1}" = $$${employee_doc.drug_test_name}$$,
        "${documents['drug_test'].field2}" = '${employee_doc.drug_test_expiration_date}' :: date,
        "${documents['drug_test'].field3}" = '${employee_doc.drug_test_issue_date}' :: date,
        "${documents['drug_test'].field4}" = '',
        "${documents['drug_test'].field5}" = $$${employee_doc.drug_test_sign}$$,
        "${documents['drug_test'].field6}" = '${employee_doc.drug_test_disclaimer}'

        `;
        break;

      case "auto_license_doc":
        query = query + `
        "${documents['auto_license'].field1}" = $$${employee_doc.auto_license_state}$$',
        "${documents['auto_license'].field2}" = '${employee_doc.auto_license_number}',
        "${documents['auto_license'].field3}" = '${employee_doc.auto_license_expiration_date}' :: date,
        "${documents['auto_license'].field4}" = '${employee_doc.auto_license_issue_date}' :: date,
        "${documents['auto_license'].field5}" = '',
        "${documents['auto_license'].field6}" = $$${employee_doc.auto_license_sign}$$,
        "${documents['auto_license'].field7}" = '${employee_doc.auto_license_disclaimer}'

        `;
        break;

      case "cdl_license_doc":
        query = query + `
        "${documents['cdl_license'].field1}" = $$${employee_doc.cdl_license_state}$$,
        "${documents['cdl_license'].field2}" = '${employee_doc.cdl_license_number}',
        "${documents['cdl_license'].field3}" = '${employee_doc.cdl_license_issue_date}' :: date,
        "${documents['cdl_license'].field4}" = $$${employee_doc.cdl_license_doc}$$,
        "${documents['cdl_license'].field5}" = $$${employee_doc.cdl_license_sign}$$,
        "${documents['cdl_license'].field6}" = '${employee_doc.cdl_license_disclaimer}',
        "${documents['cdl_license'].field7}" = '${employee_doc.cdl_license_type}'
        `;
        break;

      case "work_agreement_doc":
        query = query + `
        "${documents['work_agreement'].field1}" = '${employee_doc.work_agreement_date}' :: date,
        "${documents['work_agreement'].field2}" = '',
        "${documents['work_agreement'].field3}" = $$${employee_doc.work_agreement_sign}$$,
        "${documents['work_agreement'].field4}" = '${employee_doc.work_agreement_disclaimer}'

        `;
        break;

      case "itinerary_doc":
        query = query + `
        "${documents['itinerary'].field1}" = '${employee_doc.itinerary_date}' :: date,
        "${documents['itinerary'].field2}" = '',
        "${documents['itinerary'].field3}" = $$${employee_doc.itinerary_sign}$$,
        "${documents['itinerary'].field4}" = '${employee_doc.itinerary_disclaimer}'

        
        `;
        break;

      case "visa_doc":
        query = query + `
        "${documents['visa'].field1}" = $$${employee_doc.visa_control_number}$$,
        "${documents['visa'].field2}" = '${employee_doc.visa_issue_date}' :: date,
        "${documents['visa'].field3}" = '${employee_doc.visa_expiration_date}' :: date,
        "${documents['visa'].field4}" = $$${employee_doc.visa_nationality}$$,
        "${documents['visa'].field5}" = $$${employee_doc.visa_red_stamped_no}$$,
        "${documents['visa'].field6}" = $$${employee_doc.visa_issue_post}$$,
        "${documents['visa'].field7}" = '',
        "${documents['visa'].field8}" = $$${employee_doc.visa_sign}$$,
        "${documents['visa'].field9}" = '${employee_doc.visa_disclaimer}'

        `;
        break;

      case "i9_doc":
        query = query + `
        "${documents['i9'].field1}" = '${employee_doc.i9_date}' :: date,
        "${documents['i9'].field2}" = '',
        "${documents['i9'].field3}" = $$${employee_doc.i9_sign}$$,
        "${documents['i9'].field4}" = '${employee_doc.i9_disclaimer}'
        `;
        break;

      case "i94_doc":
        query = query + `
        "${documents['i94'].field1}" = '${employee_doc.i94_date}' :: date,
        "${documents['i94'].field2}" = '',
        "${documents['i94'].field3}" = '${employee_doc.i94_number}',
        "${documents['i94'].field4}" = $$${employee_doc.i94_sign}$$,
        "${documents['i94'].field5}" = '${employee_doc.i94_disclaimer}'

        `;
        break;

      case "cert_doc":
        query = query + `
        "${documents['cert'].field1}" = '${employee_doc.cert_arrival_date}' :: date,
        "${documents['cert'].field2}" = $$${employee_doc.cert_first_day}$$,
        "${documents['cert'].field3}" = '',
        "${documents['cert'].field4}" = $$${employee_doc.cert_sign}$$,
        "${documents['cert'].field5}" = '${employee_doc.cert_disclaimer}'

        `;
        break;

      case "department_doc":
        query = query + `
        "${documents['department'].field1}" = '${employee_doc.department_last_day}',
        "${documents['department'].field2}" = '${employee_doc.department_departure_date}':: date,
        "${documents['department'].field3}" = '',
        "${documents['department'].field4}" = $$${employee_doc.department_sign}$$,
        "${documents['department'].field5}" = '${employee_doc.department_disclaimer}'

        `;
        break;

      case "handbook_doc":
        query = query + `
        "${documents['handbook'].field1}" = '${employee_doc.handbook_date}' :: date,
        "${documents['handbook'].field2}" = '',
        "${documents['handbook'].field3}" = $$${employee_doc.handbook_sign}$$,
        "${documents['handbook'].field4}" = '${employee_doc.handbook_disclaimer}'

        `;
        break;

      case "rules_doc":
        query = query + `
        "${documents['rules'].field1}" = '${employee_doc.rules_date}' :: date,
        "${documents['rules'].field2}" = '',
        "${documents['rules'].field3}" = $$${employee_doc.rules_sign}$$,
        "${documents['rules'].field4}" = '${employee_doc.rules_disclaimer}'

        `;
        break;

      case "drug_policy_doc":
        query = query + `
        "${documents['drug_policy'].field1}" = '${employee_doc.drug_policy_date}' :: date,
        "${documents['drug_policy'].field2}" = '',
        "${documents['drug_policy'].field3}" = $$${employee_doc.drug_policy_sign}$$,
        "${documents['drug_policy'].field4}" = '${employee_doc.drug_policy_disclaimer}'

        `;
        break;

      case "reprimand_policy_doc":
        query = query + `
        "${documents['reprimand_policy'].field1}" = '${employee_doc.reprimand_policy_date}' :: date,
        "${documents['reprimand_policy'].field2}" = '',
        "${documents['reprimand_policy'].field3}" = $$${employee_doc.reprimand_policy_sign}$$,
        "${documents['reprimand_policy'].field4}" = '${employee_doc.reprimand_policy_disclaimer}'

        `;
        break;

      case "equipment_policy_doc":
        query = query + `
        "${documents['equipment_policy'].field1}" = '${employee_doc.equipment_policy_date}' :: date,
        "${documents['equipment_policy'].field2}" = '',
        "${documents['equipment_policy'].field3}" = $$${employee_doc.equipment_policy_sign}$$,
        "${documents['equipment_policy'].field4}" = '${employee_doc.equipment_policy_disclaimer}'

        `;
        break;

      case "departure_doc":
        query = query + `
        "${documents['departure'].field1}" = '${employee_doc.departure_date}' :: date,
        "${documents['departure'].field2}" = '',
        "${documents['departure'].field3}" = $$${employee_doc.departure_sign}$$,
        "${documents['departure'].field4}" = '${employee_doc.departure_disclaimer}'

        `;
        break;

      case "bank_acc_doc":
        query = query + `
        "${documents['bank_acc'].field1}" = $$${employee_doc.bank_acc_name}$$,
        "${documents['bank_acc'].field2}" = $$${employee_doc.bank_acc_routing}$$,
        "${documents['bank_acc'].field3}" = $$${employee_doc.bank_acc_account}$$,
        "${documents['bank_acc'].field4}" = '',
        "${documents['bank_acc'].field5}" = $$${employee_doc.bank_acc_sign}$$,
        "${documents['bank_acc'].field6}" = '${employee_doc.bank_acc_disclaimer}'

        `;
        break;
      case "social_sec_doc":
        query = query + `
        "${documents['social_sec'].field1}" = $$${employee_doc.social_sec_number}$$,
        "${documents['social_sec'].field2}" = $$${employee_doc.social_sec_name}$$,
        "${documents['social_sec'].field3}" = '',
        "${documents['social_sec'].field4}" = $$${employee_doc.social_sec_sign}$$,
        "${documents['social_sec'].field5}" = '${employee_doc.social_sec_disclaimer}'

        `;
        break;

      case "w4_doc":
        query = query + `
        "${documents['w4'].field1}" = $$${employee_doc.w4_name}$$,
        "${documents['w4'].field2}" = '',
        "${documents['w4'].field3}" = $$${employee_doc.w4_sign}$$,
        "${documents['w4'].field4}" = '${employee_doc.w4_disclaimer}',
        "${documents['w4'].field5}" = '${employee_doc.w4_no_of_dependents}'
        `;
        break;

      case "cdl_training":
        query = query + `
        "${documents['cdl_training'].field1}" = '${employee_doc.cdl_training_date}' :: date,
        "${documents['cdl_training'].field2}" = $$${employee_doc.cdl_training_sign}$$,
        "${documents['cdl_training'].field3}" = '${employee_doc.cdl_training_disclaimer}'
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