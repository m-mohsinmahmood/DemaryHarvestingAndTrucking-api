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
            "id",
            "first_name",
            "last_name",
            "email",
            "cell_phone_number",
            "home_phone_number",
            "date_of_birth",
            "age",
            "marital_status",
            "languages",
            "rank_speaking_english",
            "address_1",
            "address_2",
            "town_city",
            "county_providence",
            "state",
            "postal_code",
            "country",
            "avatar",
            "question_1",
            "question_2",
            "question_3",
            "question_4",
            "question_5",
            "authorized_to_work",
            "us_citizen",
            "cdl_license",
            "lorry_license",
            "tractor_license",
            "passport",
            "work_experience_description",
            "employment_period",
            "supervisor_name",
            "supervisor_contact",
            "degree_name",
            "reason_for_applying",
            "hear_about_dht",
            "us_phone_number",
            "blood_type",
            "emergency_contact_name",
            "emergency_contact_phone",
            "first_call_remarks",
            "first_call_ranking",
            "first_interviewer_id",
            "reference_call_remarks",
            "reference_call_ranking",
            "reference_interviewer_id",
            "second_call_remarks",
            "second_call_ranking",
            "second_interviewer_id",
            "third_call_remarks",
            "third_call_ranking",
            "third_interviewer_id",
            "status_step",
            "status_message",
            "step_one_status_date",
            "step_two_status_date",
            "step_three_status_date",
            "step_four_status_date",
            "step_five_status_date",
            "step_six_status_date",
            "step_seven_status_date",
            "step_eight_status_date",
            "step_nine_status_date",
            "step_ten_status_date",
            "step_eleven_status_date",
            "step_twelve_status_date",
            "step_thirteen_status_date",
            "created_at"
    FROM 
            "Applicants"
    WHERE 
            "id" = '${applicant_id}';
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
          step: `Advance Preliminary Review`, date: resp.step_two_status_date, status: true,
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
          step: `Third Interview Completed`, date: resp.step_five_status_date,
          status: resp.third_interviewer_id && resp.third_call_ranking && resp.third_call_remarks ? true : false,
          show: +resp.status_step >= 5 && resp.third_interviewer_id ? true : false,
          active: +resp.status_step >= 5 ? true : false,
          click: +resp.status_step == 5 && resp.third_call_ranking && resp.third_call_remarks ? true : false
        },
        {
          step: `Reference Call Completed`, date: resp.step_six_status_date,
          status: resp.reference_interviewer_id && resp.reference_call_ranking && resp.reference_call_remarks ? true : false,
          show: +resp.status_step >= 6 && resp.reference_interviewer_id ? true : false,
          active: +resp.status_step >= 6 ? true : false,
          click: +resp.status_step == 6 && resp.reference_call_ranking && resp.reference_call_remarks ? true : false
        },
        {
          step: `Recruiter Decision Made`, date: resp.step_seven_status_date,
          status: resp.reference_interviewer_id && resp.reference_call_ranking && resp.reference_call_remarks ? true : false,
          show: +resp.status_step >= 6 && resp.reference_interviewer_id ? true : false,
          active: +resp.status_step >= 6 ? true : false,
          click: +resp.status_step == 6 && resp.reference_call_ranking && resp.reference_call_remarks ? true : false
        },
        {
          step: `Offer Made`, date: resp.step_eight_status_date, status: +resp.status_step >= 8 ? true : false,
          show: +resp.status_step >= 8 && resp.step_eight_status_date ? true : false,
          active: +resp.status_step >= 8 ? true : false
        },
        {
          step: `Offer Accepted`, date: resp.step_nine_status_date, status: +resp.status_step >= 9 ? true : false,
          show: +resp.status_step >= 8 && resp.step_eight_status_date ? true : false,
          active: +resp.status_step >= 8 ? true : false
        },
        {
          step: `Results ${results_status[resp.status_step] ? '( ' + results_status[resp.status_step] + ' )' : ''}`, date: resp.step_eleven_status_date, status: +resp.status_step >= 10 ? true : false,
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

    // Dummy Employee Name //
    let recruiters = [
      {
        id: "84df662a-8687-47ff-8f6f-1a2b27f9a95d",
        name: "Matt Demaray",
        calendly: [
          "Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/matt_dht-usa/interview-teams",
          "</br>Click here to schedule an interview using Zoom:  https://calendly.com/matt_dht-usa/interview-zoom",
          "</br>Click here to schedule an interview using Phone:  https://calendly.com/matt_dht-usa/interview-phone-1"
        ]

      },
      {
        id: "8d0414fa-fbe6-417c-b7d5-3ab1bf1aaffd",
        name: "Bill Demaray",
        calendly: [
          "Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/bill_dht-usa/interview-teams",
          "</br>Click here to schedule an interview using Zoom:  https://calendly.com/bill_dht-usa/interview-zoom",
          "</br>Click here to schedule an interview using Phone:  https://calendly.com/bill_dht-usa/interview-phone-1"
        ]
      },
      {
        id: "524c9a3c-af1c-4159-95fd-ddf72eab357f",
        name: "Craig Reinhart",
        calendly: [
          "Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/craig_dht-usa/interview-teams",
          "</br>Click here to schedule an interview using Zoom:  https://calendly.com/craig_dht-usa/interview-zoom",
          "</br>Click here to schedule an interview using Phone:  https://calendly.com/craig_dht-usa/interview-phone-1"
        ]
      }
    ];
    let newObject = {
      first_interviewer_name: recruiters.filter(i => i.id == resp.first_interviewer_id)[0]?.name,
      second_interviewer_name: recruiters.filter(i => i.id == resp.second_interviewer_id)[0]?.name,
      third_interviewer_name: recruiters.filter(i => i.id == resp.third_interviewer_id)[0]?.name,
      reference_interviewer_name: recruiters.filter(i => i.id == resp.reference_interviewer_id)[0]?.name
    };
    resp = Object.assign(resp, newObject);
    // Dummy Employee Name //

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
