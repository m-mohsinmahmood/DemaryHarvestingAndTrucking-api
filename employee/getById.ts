import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee_id: string = req.query.id;

    let employee_info_query = `
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
                e2."status_step" , 
                e2."step_one_date",	
                e2."step_two_date",	
                e2."step_three_date",	
                e2."step_four_date",	
                e2."step_five_date",	
                e2."step_six_date",	
                e2."step_seven_date",	
                e2."step_eight_date",	
                e2."step_nine_date",	
                e2."step_ten_date",	
                e2."step_eleven_date",	
                e2."step_twelve_date",	
                e2."step_thirteen_date",	
                e2."step_fourteen_date",	
                e2."step_fifteen_date",	
                e2."step_sixteen_date",	
                e2."step_seventeen_date",	
                e2."step_eighteen_date",	
                e2."step_nineteen_date",	
                e2."step_twenty_date",	
                e2."account_activated",	
                e2."driver_license_ss_card",	
                e2."compliance_docs",	
                e2."contract_created",	
                e2."contract_w4",	
                e2."bank_account",	
                e2."additional_compliance_docs",	
                e2."cdl_training",	
                e2."travel_arrangements",	
                e2."results",	
                e2."modified_at",	
                e2."status_message",	
                e2."prev_status_message",	
                e3."id",	
                e3."employee_id",	
                e3."category",	
                e3."passport_country",	
                e3."passport_number",	
                e3."passport_expiration_date",	
                e3."passport_doc",	
                e3."passport_sign",	
                e3."passport_disclaimer",	
                e3."approval_letter_date",	
                e3."approval_letter_doc",	
                e3."approval_letter_sign",	
                e3."approval_letter_disclaimer",	
                e3."contract_date",	
                e3."contract_doc",	
                e3."contract_sign",	
                e3."contract_disclaimer",	
                e3."b797_date",	
                e3."b797_expiration_date",	
                e3."b797_doc",
                e3."b797_sign",
                e3."b797_disclaimer",	
                e3."dot_physical_name",	
                e3."dot_physical_expiration_date",	
                e3."dot_physical_issue_date",	
                e3."dot_physical_doc",	
                e3."dot_physical_sign",	
                e3."dot_physical_disclaimer",	
                e3."drug_test_name",	
                e3."drug_test_expiration_date",	
                e3."drug_test_issue_date",	
                e3."drug_test_doc",	
                e3."drug_test_sign",	
                e3."drug_test_disclaimer",	
                e3."auto_license_state",	
                e3."auto_license_number",	
                e3."auto_license_expiration_date",	
                e3."auto_license_issue_date",	
                e3."auto_license_doc",	
                e3."auto_license_sign",	
                e3."auto_license_disclaimer",	
                e3."cdl_license_state",	
                e3."cdl_license_number",	
                e3."cdl_license_issue_date",	
                e3."cdl_license_doc",	
                e3."cdl_license_sign",	
                e3."cdl_license_disclaimer",	
                e3."work_agreement_date",	
                e3."work_agreement_doc",	
                e3."work_agreement_sign",
                e3."work_agreement_disclaimer",	
                e3."itinerary_date",	
                e3."itinerary_doc",	
                e3."itinerary_sign",	
                e3."itinerary_disclaimer",	
                e3."visa_control_number",	
                e3."visa_issue_date",	
                e3."visa_expiration_date",	
                e3."visa_nationality",	
                e3."visa_red_stamped_no",	
                e3."visa_issue_post",	
                e3."visa_doc",	
                e3."visa_sign",	
                e3."visa_disclaimer",	
                e3."i9_date",	
                e3."i9_doc",	
                e3."i9_sign",	
                e3."i9_disclaimer",	
                e3."i94_date",	
                e3."i94_doc",	
                e3."i94_sign",	
                e3."i94_disclaimer",	
                e3."cert_arrival_date",	
                e3."cert_first_day",	
                e3."cert_doc",	
                e3."cert_sign",	
                e3."cert_disclaimer",	
                e3."department_last_day",	
                e3."department_departure_date",	
                e3."department_doc",	
                e3."department_sign",	
                e3."department_disclaimer",	
                e3."handbook_date",	
                e3."handbook_doc",	
                e3."handbook_sign",	
                e3."handbook_disclaimer",	
                e3."rules_date",	
                e3."rules_doc",	
                e3."rules_sign",	
                e3."rules_disclaimer",	
                e3."drug_policy_date",
                e3."drug_policy_doc",	
                e3."drug_policy_sign",	
                e3."drug_policy_disclaimer",	
                e3."reprimand_policy_date",	
                e3."reprimand_policy_doc",	
                e3."reprimand_policy_sign",	
                e3."reprimand_policy_disclaimer",	
                e3."departure_date",	
                e3."departure_doc",	
                e3."departure_sign",	
                e3."departure_disclaimer",	
                e3."bank_acc_name",	
                e3."bank_acc_routing",	
                e3."bank_acc_account",	
                e3."bank_acc_doc",	
                e3."bank_acc_sign",	
                e3."bank_acc_disclaimer",	
                e3."social_sec_number",	
                e3."social_sec_name",	
                e3."social_sec_doc",	
                e3."social_sec_sign",
                e3."social_sec_disclaimer",	
                e3."w4_name",	
                e3."w4_doc",	
                e3."w4_sign",	
                e3."w4_disclaimer"

        FROM 
                "Employees" e1
                FULL JOIN "Employee_Status_Bar" e2
                ON e1."id" = e2."employee_id"
                FULL JOIN "Employee_Documents" e3
                ON e1."id" = e3."employee_id"
        WHERE 
                e1."id" = '${employee_id}';
      `;

    db.connect();

    let result = await db.query(employee_info_query);
    let resp;
    let status_bar;
    if (result.rows.length > 0) {
      resp = result.rows[0];
      //#region Status Bar
      status_bar = [
        {
          step: `Account Activated`,
          date: resp.created_at,
          status: true,
          show: true,
          active: true,
          showIcons: false,
          click: +resp.status_step == 1 ? true : false
        },
        {
          step: `Email Sent to upload Drivers License and SS card`,
          date: resp.step_two_date,
          status:  +resp.status_step >= 2 && resp.driver_license_ss_card != null && resp.driver_license_ss_card  ? true : false,
          show: +resp.status_step >= 2 ? true : false,
          active: +resp.status_step >= 2 ? true : false,
          showIcons: false,
          click: +resp.status_step == 2  ? true : false
        },
        {
          step: `Drivers License and SS card verified`,
          date: resp.step_three_date,
          status:  +resp.status_step >= 3  && resp.driver_license_ss_card == 'Verified' ? true : false,
          show: +resp.status_step >= 3 ? true : false,
          active: +resp.status_step >= 3 ? true : false,
          showIcons: resp.social_sec_disclaimer == true  && resp.cdl_license_disclaimer == true ? true : false,
          click: +resp.status_step == 3  ? true : false
        },
        {
          step: `Email sent to review/sign compliance docs`,
          date: resp.step_four_date,
          status:  +resp.status_step >= 4  && resp.compliance_docs != null && resp.compliance_docs ? true : false,
          show: +resp.status_step >= 4  ? true : false,
          active: +resp.status_step >= 4 ? true : false,
          showIcons: false,
          click: +resp.status_step == 4  ? true : false
        },
        {
          step: `Compliance docs verified`,
          date: resp.step_five_date,
          status:  +resp.status_step >= 5  && resp.compliance_docs == 'Verified' ? true : false,
          show: +resp.status_step >= 5  ? true : false,
          active: +resp.status_step >= 5 ? true : false,
          showIcons: resp.work_agreement_disclaimer == true  && resp.itinerary_disclaimer == true && resp.rules_disclaimer == true && resp.handbook_disclaimer == true ? true : false,
          click: +resp.status_step == 5 ? true : false
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
          status:  +resp.status_step >= 6 && resp.contract_w4 != null && resp.contract_w4 ? true : false,
          show: +resp.status_step >= 6  ? true : false,
          active: +resp.status_step >= 6 ? true : false,
          showIcons: false,
          click: +resp.status_step == 6  ? true : false

        },
        {
          step: `Contract signed by employee is verified`,
          date: resp.step_seven_date,
          status:  +resp.status_step >= 7 && resp.contract_w4 == 'Verified' ? true : false,
          show: +resp.status_step >= 7 ? true : false,
          active: +resp.status_step >= 7 ? true : false,
          showIcons: resp.contract_disclaimer == true && resp.w4_disclaimer == true ? true : false,
          click: +resp.status_step == 7 ? true : false,
        },
        {
          step: `Email sent to set-up online bank account`,
          date: resp.step_eight_date,
          status:  +resp.status_step >= 8 && resp.bank_account != null && resp.bank_account ? true : false,
          show: +resp.status_step >= 8 ? true : false,
          active: +resp.status_step >= 8 ? true : false,
          showIcons: false,
          click: +resp.status_step == 8 ? true : false,
        },
        {
          step: `Bank account details verified`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 9 && resp.bank_account == 'Verified' ? true : false,
          show: +resp.status_step >= 9 ? true : false,
          active: +resp.status_step >= 9 ? true : false,
          showIcons: resp.bank_acc_disclaimer == true ? true : false,
          click: +resp.status_step == 9 ? true : false,
        },
        {
          step: `Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy`,
          date: resp.step_ten_date,
          status:  +resp.status_step >= 10 && resp.additional_compliance_docs != null && resp.additional_compliance_docs ? true : false,
          show: +resp.status_step >= 10 ? true : false,
          active: +resp.status_step >= 10 ? true : false,
          showIcons: false,
          click: +resp.status_step == 10 ? true : false,
        },
        {
          step: `Additional compliance docs verified`,
          date: resp.step_eleven_date,
          status:  +resp.status_step >= 11 && resp.additional_compliance_docs == 'Verified' ? true : false,
          show: +resp.status_step >= 11 ? true : false,
          active: +resp.status_step >= 11 ? true : false,
          showIcons: resp.reprimand_policy_disclaimer == true  && resp.drug_policy_disclaimer == true ? true : false,
          click: +resp.status_step == 11 ? true : false,
        },
        {
          step: `Email sent to complete CDL training`,
          date: resp.step_twelve_date,
          status:  +resp.status_step >= 12 && resp.cdl_training != null && resp.cdl_training ? true : false,
          show: +resp.status_step >= 12 ? true : false,
          active: +resp.status_step >= 12 ? true : false,
          showIcons: false,
          click: +resp.status_step == 12 ? true : false,
        },
        {
          step: `CDL training verified`,
          date: resp.step_thirteen_date,
          status:  +resp.status_step >= 13 && resp.cdl_training == 'Verified' ? true : false,
          show: +resp.status_step >= 13 ? true : false,
          active: +resp.status_step >= 13 ? true : false,
          showIcons: resp.social_sec_disclaimer == true  && resp.cdl_license_disclaimer == true ? true : false,
          click: +resp.status_step == 13 ? true : false,
        },
        {
          step: `Email sent to make travel arrangements`,
          date: resp.step_fourteen_date,
          status:  +resp.status_step >= 14 && resp.travel_arrangements != null && resp.travel_arrangements ? true : false,
          show: +resp.status_step >= 14 ? true : false,
          active: +resp.status_step >= 14 ? true : false,
          showIcons: false,
          click: +resp.status_step == 14 ? true : false,
        },
        {
          step: `Results`,
          date: resp.step_fifteen_date,
          status:  +resp.status_step >= 15 && resp.travel_arrangements == 'Verified' ? true : false,
          show: +resp.status_step >= 15 ? true : false,
          active: +resp.status_step >= 15 ? true : false,
          showIcons: false,
          click: +resp.status_step == 15 ? true : false,
        },
      ];
      //#endregion
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
