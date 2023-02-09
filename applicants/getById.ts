import { applicant } from './model';
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const applicant_id: string = req.query.id;
    let applicant_query = `
        SELECT                   
              e."id" "first_interviewer_id", CONCAT (e."first_name", ' ', e."last_name", '') as "first_interviewer_name",                   
              e1."id" as "second_interviewer_id", CONCAT (e1."first_name", ' ', e1."last_name", '')  as "second_interviewer_name", 
              e2."id" as "third_interviewer_id", CONCAT (e2."first_name", ' ', e2."last_name", '')  as "third_interviewer_name", 
              e3."id" as "reference_interviewer_id", CONCAT (e3."first_name", ' ', e3."last_name", '')  as "reference_interviewer_name", 
              a."id",                  
              a."first_name",                  
              a."last_name",                  
              a."email",                  
              a."cell_phone_number",     
              a."cell_phone_country_code",             
              a."home_phone_number",  
              a."home_phone_country_code",    
              a."date_of_birth",
              a."age",
              a."marital_status",
              a."languages",
              a."rank_speaking_english",
              a."address_1",
              a."address_2",
              a."town_city",
              a."county_providence",
              a."state",
              a."postal_code",
              a."country",
              a."avatar",
              a."question_1",
              a."question_2",
              a."question_3",
              a."question_4",
              a."question_5",
              a."authorized_to_work",
              a."us_citizen",
              a."cdl_license",
              a."lorry_license",
              a."tractor_license",
              a."passport",
              a."work_experience_description",
              a."degree_name",
              a."reason_for_applying",
              a."hear_about_dht",
              a."unique_fact",
              a."first_call_remarks",
              a."first_call_ranking",
              a."first_interviewer_id",
              a."reference_call_remarks",
              a."reference_call_ranking",
              a."reference_interviewer_id",
              a."second_call_remarks",
              a."second_call_ranking",
              a."second_interviewer_id",
              a."third_call_remarks",
              a."third_call_ranking",
              a."third_interviewer_id",
              a."status_step",
              a."status_message",
              a."step_one_status_date",
              a."step_two_status_date",
              a."step_three_status_date",
              a."step_four_status_date",
              a."step_five_status_date",
              a."step_six_status_date",
              a."step_seven_status_date",
              a."step_eight_status_date",
              a."step_nine_status_date",
              a."step_ten_status_date",
              a."step_eleven_status_date",
              a."step_twelve_status_date",
              a."step_thirteen_status_date",
              a."unique_fact",
              a."reason_for_rejection",
              a."ranking",
              a."current_employer",
              a."current_position_title",
              a."current_description_of_role",
              a."current_employment_period_start", 
              a."current_employment_period_end",
              a."current_supervisor_reference",
              a."current_supervisor_phone_number",
              a."current_supervisor_country_code",
              a."current_contact_supervisor",
              a."previous_employer",
              a."previous_position_title",
              a."previous_description_of_role",
              a."previous_employment_period_start",
              a."previous_employment_period_end",
              a."previous_supervisor_reference",
              a."previous_supervisor_phone_number",
              a."previous_supervisor_country_code",
              a."previous_contact_supervisor",
              a."school_college",
              a."graduation_year",	
              a."employment_period",			
              a."resume",                  
              a."created_at"        
        FROM                   
              "Applicants" a 
              LEFT JOIN "Employees" e ON e."id" = first_interviewer_id and a."id" = '${applicant_id}' 
              LEFT JOIN "Employees" e1 ON e1."id" = second_interviewer_id and a."id" = '${applicant_id}' 
              LEFT JOIN "Employees" e2 ON e2."id" = third_interviewer_id and a."id" = '${applicant_id}' 
              LEFT JOIN "Employees" e3 ON e3."id" = reference_interviewer_id and a."id" = '${applicant_id}' 
      
        WHERE 
              a."id" = '${applicant_id}';
      `;

    db.connect();

    let result = await db.query(applicant_query);
    let resp;
    let status_bar;
    let results_status = {
      "10.1": "Hired",
      "10.2": "Waitlisted",
      "10.3": "Qualifications dont match current openings",
      "10.4": "Did not accept offer"
    }
    if (result.rows.length > 0) {
      resp = result.rows[0];
      //#region Status Bar
      status_bar = [
        { step: `Application Submitted`, date: resp.created_at, status: true, show: true, active: true },
        {
          step: `Preliminary Review`, date: resp.step_two_status_date,
          status:  +resp.status_step >= 3 ? true : false,
          show: true, active: true,
          click: +resp.status_step == 2 ? true : false
        },
        {
          step: `First Interview Completed`, date: resp.step_three_status_date,
          status: resp.first_interviewer_id && resp.first_call_ranking && resp.first_call_remarks ? true : false,
          show: +resp.status_step >= 3 && resp.first_interviewer_id ? true : false,
          active: +resp.status_step >= 3 ? true : false,
          click: +resp.status_step == 3 && resp.first_call_ranking && resp.first_call_remarks ? true : false
        },
        {
          step: `Second Interview Completed`, date: resp.step_four_status_date,
          status: resp.second_interviewer_id && resp.second_call_ranking && resp.second_call_remarks ? true : false,
          show: +resp.status_step >= 4 && resp.second_interviewer_id ? true : false,
          active: +resp.status_step >= 4 ? true : false,
          click: +resp.status_step == 4 && resp.second_call_ranking && resp.second_call_remarks ? true : false
        },
        {
          step: `Reference Call Completed`, date: resp.step_five_status_date,
          status: resp.reference_interviewer_id && resp.reference_call_ranking && resp.reference_call_remarks ? true : false,
          show: +resp.status_step >= 5 && resp.reference_interviewer_id ? true : false,
          active: +resp.status_step >= 5 ? true : false,
          click: +resp.status_step == 5 && resp.reference_call_ranking && resp.reference_call_remarks ? true : false
        },
        {
          step: `Third Interview Completed`, date: resp.step_six_status_date,
          status: resp.third_interviewer_id && resp.third_call_ranking && resp.third_call_remarks ? true : false,
          show: +resp.status_step >= 6 && resp.third_interviewer_id ? true : false,
          active: +resp.status_step >= 6 ? true : false,
          click: +resp.status_step == 6 && resp.third_call_ranking && resp.third_call_remarks ? true : false
        },
        {
          step: `Recruiter Decision Made`, date: resp.step_seven_status_date,
          status: resp.third_interviewer_id && resp.third_call_ranking && resp.third_call_remarks ? true : false,
          show: +resp.status_step >= 6 && resp.third_interviewer_id ? true : false,
          active: +resp.status_step >= 6 ? true : false,
          click: +resp.status_step == 6 && resp.third_call_ranking && resp.third_call_remarks ? true : false
        },
        {
          step: `Offer Made`, date: resp.step_eight_status_date, status: +resp.status_step >= 8 ? true : false,
          show: +resp.status_step >= 8 && resp.step_eight_status_date ? true : false,
          active: +resp.status_step >= 8 ? true : false
        },
        {
          step: `Offer Accepted`, date: resp.step_nine_status_date, status: +resp.status_step >= 9 ? true : false,
          show: +resp.status_step >= 8 && resp.step_eight_status_date ? true : false,
          active: +resp.status_step >= 8 ? true : false,
          click: +resp.status_step == 8 ? true : false,
        },
        {
          step: `Results ${results_status[resp.status_step] ? '(' + results_status[resp.status_step] + ')' : ''}`, date: resp.step_eleven_status_date, status: +resp.status_step >= 10 ? true : false,
          show: +resp.status_step >= 10 ? true : false,
          active: +resp.status_step >= 10 ? true : false
        }
      ];
      //#endregion
    }
    else {
      resp = {
        message: "No applicant exists with this id.",
      };
    }


    db.end();

    console.log(status_bar);
    context.res = {
      status: 200,
      body: {
        applicant_info: resp,
        applicant_status_bar: status_bar
      }
    };

    context.done();
    return;
  }
  catch (err) {
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
