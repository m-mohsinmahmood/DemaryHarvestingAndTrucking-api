import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee_id: string = req.query?.id;
    const firebase_id: string = req.query?.fb_id;
    const h2a_employee: string = req.query?.h2a;

    if (firebase_id) {
      let employee_id_query = `
        SELECT 
               "id"
        FROM 
                "Employees" 
        Where fb_id = '${firebase_id}'        
      `;

      db.connect();

      let result = await db.query(employee_id_query);
      let resp;
      if (result.rows.length > 0) resp = result.rows[0];
      else
        resp = {
          message: "No Employee with this id.",
        };

      db.end();

      context.res = {
        status: 200,
        body: resp,
      };
      context.done();
      return;
    }
    else {
      let employee_info_query
      employee_info_query = `
          SELECT 
                e1."id",
                e1."first_name",	
                e1."last_name",  
                e1."email",	
                e1."cell_phone_number",	
                e1."home_phone_number",	
                e1."date_of_birth"	,
                e1."age",
                e1."marital_status",	
                e1."languages",	
                e1."rank_speaking_english",	
                e1."address_1",	
                e1."address_2",	
                e1."town_city",	
                e1."county_providence",	
                e1."state",	
                e1."postal_code",	
                e1."country",	
                e1."avatar",	
                e1."question_1",	
                e1."question_2",	
                e1."question_3",	
                e1."question_4",	
                e1."question_5",	
                e1."authorized_to_work",	
                e1."us_citizen",
                e1."cdl_license",	
                e1."lorry_license",	
                e1."tractor_license",	
                e1."passport",	
                e1."work_experience_description",	
                e1."degree_name",	
                e1."reason_for_applying",	
                e1."hear_about_dht",	
                e1."us_phone_number",	
                e1."blood_type",	
                e1."emergency_contact_name",	
                e1."emergency_contact_phone",	
                e1."modified_at",	
                e1."created_at",	
                e1."is_deleted",	
                e1."status_step"		,	
                e1."unique_fact",	
                e1."reason_for_rejection",	
                e1."ranking",	
                e1."current_employer",	
                e1."current_position_title",	
                e1."current_description_of_role",	
                e1."current_employment_period_start",	
                e1."current_employment_period_end",	
                e1."current_supervisor_reference",	
                e1."current_supervisor_phone_number",	
                e1."current_contact_supervisor",	
                e1."previous_employer",	
                e1."previous_position_title",	
                e1."previous_description_of_role",	
                e1."previous_employment_period_start",	
                e1."previous_employment_period_end",	
                e1."previous_supervisor_reference",	
                e1."previous_supervisor_phone_number",	
                e1."previous_contact_supervisor",	
                e1."school_college",	
                e1."graduation_year",	
                e1."resume",	
                e1."role",	
                e1."status",	
                e1."calendly",	  
                e2."id",	
                e2."employee_id",	
                e2."category",	
                e2."passport_country",	
                e2."passport_number",	
                e2."passport_expiration_date",	
                e2."passport_doc",	
                e2."passport_sign",	
                e2."passport_disclaimer",	
                e2."approval_letter_date",	
                e2."approval_letter_doc",	
                e2."approval_letter_sign",	
                e2."approval_letter_disclaimer",	
                e2."contract_date",	
                e2."contract_doc",	
                e2."contract_sign",	
                e2."contract_disclaimer",	
                e2."b797_date",	
                e2."b797_expiration_date",	
                e2."b797_doc",
                e2."b797_sign",
                e2."b797_disclaimer",	
                e2."dot_physical_name",	
                e2."dot_physical_expiration_date",	
                e2."dot_physical_issue_date",	
                e2."dot_physical_doc",	
                e2."dot_physical_sign",	
                e2."dot_physical_disclaimer",	
                e2."drug_test_name",	
                e2."drug_test_expiration_date",	
                e2."drug_test_issue_date",	
                e2."drug_test_doc",	
                e2."drug_test_sign",	
                e2."drug_test_disclaimer",	
                e2."auto_license_state",	
                e2."auto_license_number",	
                e2."auto_license_expiration_date",	
                e2."auto_license_issue_date",	
                e2."auto_license_doc",	
                e2."auto_license_sign",	
                e2."auto_license_disclaimer",	
                e2."cdl_license_state",	
                e2."cdl_license_number",	
                e2."cdl_license_issue_date",	
                e2."cdl_license_doc",	
                e2."cdl_license_sign",	
                e2."cdl_license_disclaimer",	
                e2."work_agreement_date",	
                e2."work_agreement_doc",	
                e2."work_agreement_sign",
                e2."work_agreement_disclaimer",	
                e2."itinerary_date",	
                e2."itinerary_doc",	
                e2."itinerary_sign",	
                e2."itinerary_disclaimer",	
                e2."visa_control_number",	
                e2."visa_issue_date",	
                e2."visa_expiration_date",	
                e2."visa_nationality",	
                e2."visa_red_stamped_no",	
                e2."visa_issue_post",	
                e2."visa_doc",	
                e2."visa_sign",	
                e2."visa_disclaimer",	
                e2."i9_date",	
                e2."i9_doc",	
                e2."i9_sign",	
                e2."i9_disclaimer",	
                e2."i94_date",	
                e2."i94_doc",	
                e2."i94_sign",	
                e2."i94_disclaimer",	
                e2."cert_arrival_date",	
                e2."cert_first_day",	
                e2."cert_doc",	
                e2."cert_sign",	
                e2."cert_disclaimer",	
                e2."department_last_day",	
                e2."department_departure_date",	
                e2."department_doc",	
                e2."department_sign",	
                e2."department_disclaimer",	
                e2."handbook_date",	
                e2."handbook_doc",	
                e2."handbook_sign",	
                e2."handbook_disclaimer",	
                e2."rules_date",	
                e2."rules_doc",	
                e2."rules_sign",	
                e2."rules_disclaimer",	
                e2."drug_policy_date",
                e2."drug_policy_doc",	
                e2."drug_policy_sign",	
                e2."drug_policy_disclaimer",	
                e2."reprimand_policy_date",	
                e2."reprimand_policy_doc",	
                e2."reprimand_policy_sign",	
                e2."reprimand_policy_disclaimer",	
                e2."departure_date",	
                e2."departure_doc",	
                e2."departure_sign",	
                e2."departure_disclaimer",	
                e2."bank_acc_name",	
                e2."bank_acc_routing",	
                e2."bank_acc_account",	
                e2."bank_acc_doc",	
                e2."bank_acc_sign",	
                e2."bank_acc_disclaimer",	
                e2."social_sec_number",	
                e2."social_sec_name",	
                e2."social_sec_doc",	
                e2."social_sec_sign",
                e2."social_sec_disclaimer",	
                e2."w4_name",	
                e2."w4_doc",	
                e2."w4_sign",	
                e2."w4_no_of_dependents",
                e2."w4_disclaimer" ,
                e2."cdl_training_sign",	
                e2."cdl_training_date",
                e2."cdl_training_disclaimer" `;

      h2a_employee == 'true' ? employee_info_query = employee_info_query + `,
                e3."id",	
                e3."employee_id",	
                e3."status_step" , 
                e3."step_one_date",	
                e3."step_two_date",	
                e3."step_three_date",	
                e3."step_four_date",	
                e3."step_five_date",	
                e3."step_six_date",	
                e3."step_seven_date",	
                e3."step_eight_date",	
                e3."step_nine_date",	
                e3."step_ten_date",	
                e3."step_eleven_date",	
                e3."step_twelve_date",	
                e3."step_thirteen_date",	
                e3."step_fourteen_date",	
                e3."step_fifteen_date",	
                e3."step_sixteen_date",	
                e3."step_seventeen_date",	
                e3."step_eighteen_date",	
                e3."account_activated",	
                e3."passport_driver_license",	
                e3."compliance_docs",	
                e3."visa",	
                e3."contract_approval_letter",	
                e3."bank_account",	
                e3."additional_compliance_docs",	
                e3."travel_arrangements",	
                e3."results",	
                e3."modified_at",	
                e3."status_message",	
                e3."prev_status_message"
                ` :
        employee_info_query = employee_info_query + `,
                e3."id",	
                e3."employee_id",	
                e3."status_step" , 
                e3."step_one_date",	
                e3."step_two_date",	
                e3."step_three_date",	
                e3."step_four_date",	
                e3."step_five_date",	
                e3."step_six_date",	
                e3."step_seven_date",	
                e3."step_eight_date",	
                e3."step_nine_date",	
                e3."step_ten_date",	
                e3."step_eleven_date",	
                e3."step_twelve_date",	
                e3."step_thirteen_date",	
                e3."step_fourteen_date",	
                e3."step_fifteen_date",	
                e3."step_sixteen_date",	
                e3."step_seventeen_date",	
                e3."step_eighteen_date",	
                e3."step_nineteen_date",	
                e3."step_twenty_date",	
                e3."account_activated",	
                e3."driver_license_ss_card",	
                e3."compliance_docs",	
                e3."contract_created",	
                e3."contract_w4",	
                e3."bank_account",	
                e3."additional_compliance_docs",	
                e3."cdl_training",	
                e3."travel_arrangements",	
                e3."results",	
                e3."modified_at",	
                e3."status_message",	
                e3."prev_status_message"
                `

      employee_info_query = employee_info_query + `
          FROM 
                "Employees" e1
                FULL JOIN "Employee_Documents" e2
                ON e1."id" = e2."employee_id" `;
      h2a_employee == "true" ?
        employee_info_query = employee_info_query + `
                FULL JOIN "H2a_Status_Bar" e3
                ON e1."id" = e3."employee_id" ` :
        employee_info_query = employee_info_query + `
                FULL JOIN "Employee_Status_Bar" e3
                ON e1."id" = e3."employee_id"`;

      employee_info_query = employee_info_query + `
          WHERE 
                e1."id" = '${employee_id}';
      `;

      db.connect();

      let result = await db.query(employee_info_query);
      let resp;
      let status_bar;
      resp = result.rows[0];
      if (result.rows.length > 0 && h2a_employee != 'true') {
        //#region Status Bar
        status_bar = [
          {
            step: `Account Activated`,
            date: resp.created_at,
            status: true,
            show: true,
            active: true,
            showIcons: false,
            click: +resp.status_step == 1 ? true : false,
            statusBar: 'account_activated',
          },
          {
            step: `Email Sent to upload Drivers License and SS card`,
            date: resp.step_two_date,
            status: +resp.status_step >= 2 && resp.driver_license_ss_card ? true : false,
            show: +resp.status_step >= 2 ? true : false,
            active: +resp.status_step >= 2 ? true : false,
            showIcons: false,
            click: +resp.status_step == 2 ? true : false,
            statusBar: 'driver_license_ss_card',
          },
          {
            step: `Drivers License and SS card verified`,
            date: resp.step_three_date,
            status: +resp.status_step >= 3 && resp.driver_license_ss_card == 'Verified' ? true : false,
            show: +resp.status_step >= 3 ? true : false,
            active: +resp.status_step >= 3 ? true : false,
            showIcons: resp.social_sec_disclaimer == true && resp.cdl_license_disclaimer == true ? true : false,
            click: +resp.status_step == 3 ? true : false,
            statusBar: 'driver_license_ss_card',
          },
          {
            step: `Email sent to review/sign compliance docs`,
            date: resp.step_four_date,
            status: +resp.status_step >= 4 && resp.compliance_docs ? true : false,
            show: +resp.status_step >= 4 ? true : false,
            active: +resp.status_step >= 4 ? true : false,
            showIcons: false,
            click: +resp.status_step == 4 ? true : false,
            statusBar: 'compliance_docs',
          },
          {
            step: `Compliance docs verified`,
            date: resp.step_five_date,
            status: +resp.status_step >= 5 && resp.compliance_docs == 'Verified' ? true : false,
            show: +resp.status_step >= 5 ? true : false,
            active: +resp.status_step >= 5 ? true : false,
            showIcons: resp.work_agreement_disclaimer == true && resp.itinerary_disclaimer == true && resp.rules_disclaimer == true && resp.handbook_disclaimer == true ? true : false,
            click: +resp.status_step == 5 ? true : false,
            statusBar: 'compliance_docs',
          },
          // {
          //   step: `System creates contract`,
          //   date: resp.step_six_date,
          //   status:  +resp.status_step >= 6 ? true : false,
          //   show: +resp.status_step >= 6  ? true : false,
          //   showIcons: false,
          //   active: +resp.status_step >= 6 ? true : false,
          // },
          // {
          //   step: `Admin reviews/approves contract`,
          //   date: resp.step_seven_date,
          //   status:  +resp.status_step >= 6 && resp.contract_created == 'Verified' ? true : false,
          //   show: +resp.status_step >= 6  ? true : false,
          //   active: +resp.status_step >= 6 ? true : false,
          //   showIcons: true,
          //   click: +resp.status_step == 6  ? true : false
          // },
          {
            step: `Email Sent to notify that contract and W4 posted`,
            date: resp.step_six_date,
            status: +resp.status_step >= 6 && resp.contract_w4 ? true : false,
            show: +resp.status_step >= 6 ? true : false,
            active: +resp.status_step >= 6 ? true : false,
            showIcons: false,
            click: +resp.status_step == 6 ? true : false,
            statusBar: 'contract_w4',

          },
          {
            step: `Contract signed by employee is verified`,
            date: resp.step_seven_date,
            status: +resp.status_step >= 7 && resp.contract_w4 == 'Verified' ? true : false,
            show: +resp.status_step >= 7 ? true : false,
            active: +resp.status_step >= 7 ? true : false,
            showIcons: resp.contract_disclaimer == true && resp.w4_disclaimer == true ? true : false,
            click: +resp.status_step == 7 ? true : false,
            statusBar: 'contract_w4',
          },
          {
            step: `Email sent to set-up online bank account`,
            date: resp.step_eight_date,
            status: +resp.status_step >= 8 && resp.bank_account ? true : false,
            show: +resp.status_step >= 8 ? true : false,
            active: +resp.status_step >= 8 ? true : false,
            showIcons: false,
            click: +resp.status_step == 8 ? true : false,
            statusBar: 'bank_account',
          },
          {
            step: `Bank account details verified`,
            date: resp.step_nine_date,
            status: +resp.status_step >= 9 && resp.bank_account == 'Verified' ? true : false,
            show: +resp.status_step >= 9 ? true : false,
            active: +resp.status_step >= 9 ? true : false,
            showIcons: resp.bank_acc_disclaimer == true ? true : false,
            click: +resp.status_step == 9 ? true : false,
            statusBar: 'bank_account',
          },
          {
            step: `Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy`,
            date: resp.step_ten_date,
            status: +resp.status_step >= 10 && resp.additional_compliance_docs ? true : false,
            show: +resp.status_step >= 10 ? true : false,
            active: +resp.status_step >= 10 ? true : false,
            showIcons: false,
            click: +resp.status_step == 10 ? true : false,
            statusBar: 'additional_compliance_docs',
          },
          {
            step: `Additional compliance docs verified`,
            date: resp.step_eleven_date,
            status: +resp.status_step >= 11 && resp.additional_compliance_docs == 'Verified' ? true : false,
            show: +resp.status_step >= 11 ? true : false,
            active: +resp.status_step >= 11 ? true : false,
            showIcons: resp.reprimand_policy_disclaimer == true && resp.drug_policy_disclaimer == true ? true : false,
            click: +resp.status_step == 11 ? true : false,
            statusBar: 'additional_compliance_docs',
          },
          {
            step: `Email sent to complete CDL training`,
            date: resp.step_twelve_date,
            status:  +resp.status_step >= 12 && resp.cdl_training? true : false,
            show: +resp.status_step >= 12 ? true : false,
            active: +resp.status_step >= 12 ? true : false,
            showIcons: false,
            click: +resp.status_step == 12 ? true : false,
            statusBar: 'cdl_training',
          },
          {
            step: `CDL training verified`,
            date: resp.step_thirteen_date,
            status:  +resp.status_step >= 13 && resp.cdl_training == 'Verified' ? true : false,
            show: +resp.status_step >= 13 ? true : false,
            active: +resp.status_step >= 13 ? true : false,
            showIcons: resp.cdl_training_disclaimer == true ? true : false,
            click: +resp.status_step == 13 ? true : false,
            statusBar: 'cdl_training',
          },
          {
            step: `Email sent to make travel arrangements`,
            date: resp.step_fourteen_date,
            status: +resp.status_step >= 14 && resp.travel_arrangements ? true : false,
            show: +resp.status_step >= 14 ? true : false,
            active: +resp.status_step >= 14 ? true : false,
            showIcons: false,
            click: +resp.status_step == 14 ? true : false,
            statusBar: 'travel_arrangements',
          },
          {
            step: `Results`,
            date: resp.step_fifteen_date,
            status: +resp.status_step >= 15 && resp.travel_arrangements ? true : false,
            show: +resp.status_step >= 15 ? true : false,
            active: +resp.status_step >= 15 ? true : false,
            showIcons: false,
            click: +resp.status_step == 15 ? true : false,
            statusBar: 'results',
          },
        ];
        //#endregion


      }

      else if (result.rows.length > 0 && h2a_employee == 'true') {
        status_bar = [
          {
            step: `Account Activated`,
            date: resp.created_at,
            status: true,
            show: true,
            active: true,
            showIcons: false,
            click: +resp.status_step == 1 ? true : false,
            statusBar: 'account_activated',
          },
          {
            step: `Email Sent to upload Passport and drivers license`,
            date: resp.step_two_date,
            status: +resp.status_step >= 2 && resp.passport_driver_license ? true : false,
            show: +resp.status_step >= 2 ? true : false,
            active: +resp.status_step >= 2 ? true : false,
            showIcons: false,
            click: +resp.status_step == 2 ? true : false,
            statusBar: 'passport_driver_license',
          },
          {
            step: `Passport and Drivers License verified`,
            date: resp.step_three_date,
            status: +resp.status_step >= 3 && resp.passport_driver_license == 'Verified' ? true : false,
            show: +resp.status_step >= 3 ? true : false,
            active: +resp.status_step >= 3 ? true : false,
            showIcons: resp.passport_disclaimer == true && resp.cdl_license_disclaimer == true ? true : false,
            click: +resp.status_step == 3 ? true : false,
            statusBar: 'passport_driver_license',
          },
          {
            step: `Email sent to review/sign compliance docs`,
            date: resp.step_four_date,
            status: +resp.status_step >= 4 && resp.compliance_docs ? true : false,
            show: +resp.status_step >= 4 ? true : false,
            active: +resp.status_step >= 4 ? true : false,
            showIcons: false,
            click: +resp.status_step == 4 ? true : false,
            statusBar: 'compliance_docs',
          },
          {
            step: `Compliance docs verified`,
            date: resp.step_five_date,
            status: +resp.status_step >= 5 && resp.compliance_docs == 'Verified' ? true : false,
            show: +resp.status_step >= 5 ? true : false,
            active: +resp.status_step >= 5 ? true : false,
            showIcons: resp.work_agreement_disclaimer == true && resp.itinerary_disclaimer == true && resp.rules_disclaimer == true && resp.handbook_disclaimer == true ? true : false,
            click: +resp.status_step == 5 ? true : false,
            statusBar: 'compliance_docs',
          },
          {
            step: `Email Sent to review/complete VISA app`,
            date: resp.step_six_date,
            status: +resp.status_step >= 6 && resp.visa ? true : false,
            show: +resp.status_step >= 6 ? true : false,
            active: +resp.status_step >= 6 ? true : false,
            showIcons: false,
            click: +resp.status_step == 6 ? true : false,
            statusBar: 'visa  ',

          },
          {
            step: `Visa is verified`,
            date: resp.step_seven_date,
            status: +resp.status_step >= 7 && resp.visa == 'Verified' ? true : false,
            show: +resp.status_step >= 7 ? true : false,
            active: +resp.status_step >= 7 ? true : false,
            showIcons: resp.visa == true ? true : false,
            click: +resp.status_step == 7 ? true : false,
            statusBar: 'visa',
          },
          {
            step: `Email Sent to notify that contract and Approval letter posted`,
            date: resp.step_eight_date,
            status: +resp.status_step >= 8 && resp.contract_approval_letter ? true : false,
            show: +resp.status_step >= 8 ? true : false,
            active: +resp.status_step >= 8 ? true : false,
            showIcons: false,
            click: +resp.status_step == 8 ? true : false,
            statusBar: 'contract_approval_letter',

          },
          {
            step: `Contract signed by employee is verified`,
            date: resp.step_nine_date,
            status: +resp.status_step >= 9 && resp.contract_approval_letter == 'Verified' ? true : false,
            show: +resp.status_step >= 9 ? true : false,
            active: +resp.status_step >= 9 ? true : false,
            showIcons: resp.contract_disclaimer == true && resp.approval_letter_disclaimer == true ? true : false,
            click: +resp.status_step == 9 ? true : false,
            statusBar: 'contract_approval_letter',
          },
          {
            step: `Email sent to set-up online bank account`,
            date: resp.step_ten_date,
            status: +resp.status_step >= 10 && resp.bank_account ? true : false,
            show: +resp.status_step >= 10 ? true : false,
            active: +resp.status_step >= 10 ? true : false,
            showIcons: false,
            click: +resp.status_step == 10 ? true : false,
            statusBar: 'bank_account',
          },
          {
            step: `Bank account details verified`,
            date: resp.step_eleven_date,
            status: +resp.status_step >= 12 && resp.bank_account == 'Verified' ? true : false,
            show: +resp.status_step >= 12 ? true : false,
            active: +resp.status_step >= 12 ? true : false,
            showIcons: resp.bank_acc_disclaimer == true ? true : false,
            click: +resp.status_step == 12 ? true : false,
            statusBar: 'bank_account',
          },
          {
            step: `Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy`,
            date: resp.step_twelve_date,
            status: +resp.status_step >= 13 && resp.additional_compliance_docs ? true : false,
            show: +resp.status_step >= 13 ? true : false,
            active: +resp.status_step >= 13 ? true : false,
            showIcons: false,
            click: +resp.status_step == 13 ? true : false,
            statusBar: 'additional_compliance_docs',
          },
          {
            step: `Additional compliance docs verified`,
            date: resp.step_thirteen_date,
            status: +resp.status_step >= 14 && resp.additional_compliance_docs == 'Verified' ? true : false,
            show: +resp.status_step >= 14 ? true : false,
            active: +resp.status_step >= 14 ? true : false,
            showIcons: resp.reprimand_policy_disclaimer == true && resp.drug_policy_disclaimer == true ? true : false,
            click: +resp.status_step == 14 ? true : false,
            statusBar: 'additional_compliance_docs',
          },
          {
            step: `Email sent to make travel arrangements`,
            date: resp.step_fourteen_date,
            status: +resp.status_step >= 15 && resp.travel_arrangements ? true : false,
            show: +resp.status_step >= 15 ? true : false,
            active: +resp.status_step >= 15 ? true : false,
            showIcons: false,
            click: +resp.status_step == 15 ? true : false,
            statusBar: 'travel_arrangements',
          },
          {
            step: `Results`,
            date: resp.step_fifteen_date,
            status: +resp.status_step >= 16 && resp.travel_arrangements ? true : false,
            show: +resp.status_step >= 16 ? true : false,
            active: +resp.status_step >= 16 ? true : false,
            showIcons: false,
            click: +resp.status_step == 16 ? true : false,
            statusBar: 'results',
          },
        ];
      }
      else {
        resp = {
          message: "No employee exists with this id.",
        };
      }


      db.end();

      context.res = {
        status: 200,
        body: {
          employee_info: resp,
          employee_status_bar: status_bar
        }
      };

      context.done();
      return;
    }
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
