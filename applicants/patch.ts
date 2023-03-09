import { applicant } from './model';
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { EmailClient, EmailMessage } from "@azure/communication-email";
import { config } from "../services/database/database.config";
import { updateQuery } from "./applicant-review";
import { firebaseConfig } from "../utilities/firebase.config";
const admin = require('firebase-admin');
import { initializeFirebase } from "../utilities/initialize-firebase";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  const db2 = new Client(config);
  let make_employee_query;
  let result;
  let employee_id;
  let firebase_id;

  try {
    const applicant: any = req.body.applicant_data;
    const applicant_info: any = req.body?.applicantInfo;
    const email: any = req.body.email_data;
    const type = req.query.type;
    const skip_email = req.body.skipEmail

    // Create employee if applicant accepts offer
    if (applicant.status_message == 'Results' && applicant.status_step == '12.1') {
      if (!admin.apps.length) {
        initializeFirebase();
      }
      // Define the custom claims object
      try {
        // Create a new user
        const userRecord = await admin.auth().createUser({
          email: applicant_info.email,
          password: 'dht@123',
        });
        firebase_id = userRecord.uid;
        const customClaims = {
          country: applicant_info.country,
          fb_id: userRecord.uid,
        };

        make_employee_query = `
            INSERT INTO 
                    "Employees" 
                (
                    "first_name",
                    "last_name",
                    "legal_name",
                    "email",
                    "cell_phone_number",
                    "cell_phone_country_code",
                    "home_phone_number",
                    "home_phone_country_code",
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
                    "degree_name",
                    "reason_for_applying",
                    "hear_about_dht",                 
                    "status_step",
                    "unique_fact",
                    "current_employer",
                    "current_position_title",
                    "current_description_of_role",
                    "current_employment_period_start", 
                    "current_employment_period_end",
                    "current_supervisor_reference",
                    "current_supervisor_phone_number",
                    "current_supervisor_country_code",
                    "current_contact_supervisor",
                    "previous_employer",
                    "previous_position_title",
                    "previous_description_of_role",
                    "previous_employment_period_start",
                    "previous_employment_period_end",
                    "previous_supervisor_reference",
                    "previous_supervisor_phone_number",
                    "previous_supervisor_country_code",
                    "previous_contact_supervisor",
                    "school_college",
                    "graduation_year",
                    "resume",
                    "employment_period",
                    "applied_job",
                    "fb_id",
                    "action_required",
                    "created_at"
              )
            VALUES      
              (  
                    $$${applicant_info.first_name}$$,
                    $$${applicant_info.last_name}$$,
                    $$${applicant_info.legal_name}$$,
                    '${applicant_info.email}',
                    '${applicant_info.cell_phone_number}',
                    '${applicant_info.cell_phone_country_code}',
                    '${applicant_info.home_phone_number}',
                    '${applicant_info.home_phone_country_code}',
                    '${applicant_info.date_of_birth}',
                    '${applicant_info.age}',
                    '${applicant_info.marital_status}',
                    '${applicant_info.languages}',
                    '${applicant_info.rank_speaking_english}',
                    $$${applicant_info.address_1}$$,
                    $$${applicant_info.address_2}$$,
                    '${applicant_info.town_city}',
                    '${applicant_info.county_providence}',
                    '${applicant_info.state}',
                    '${applicant_info.postal_code}',
                    '${applicant_info.country}',
                    '${applicant_info.avatar}',
                    '${applicant_info.question_1}',
                    '${applicant_info.question_2}',
                    '${applicant_info.question_3}',
                    '${applicant_info.question_4}',
                    '${applicant_info.question_5}',
                    '${applicant_info.authorized_to_work}',
                    '${applicant_info.us_citizen}',
                    '${applicant_info.cdl_license}',
                    '${applicant_info.lorry_license}',
                    '${applicant_info.tractor_license}',
                    '${applicant_info.passport}',
                    $$${applicant_info.work_experience_description}$$,
                    '${applicant_info.degree_name}',
                    $$${applicant_info.reason_for_applying}$$,
                    '${applicant_info.hear_about_dht}',
                    '2',
                    $$${applicant_info.unique_fact}$$,
                    '${applicant_info.current_employer}',
                    '${applicant_info.current_position_title}',
                    $$${applicant_info.current_description_of_role}$$,
                    '${applicant_info.current_employment_period_start}',
                    '${applicant_info.current_employment_period_end}',
                    '${applicant_info.current_supervisor_reference}',
                    '${applicant_info.current_supervisor_phone_number}',
                    '${applicant_info.current_supervisor_country_code}',
                    '${applicant_info.current_contact_supervisor}',
                    '${applicant_info.previous_employer}',
                    '${applicant_info.previous_position_title}',
                    $$${applicant_info.previous_description_of_role}$$,
                    '${applicant_info.previous_employment_period_start}',
                    '${applicant_info.previous_employment_period_end}',
                    '${applicant_info.previous_supervisor_reference}',
                    '${applicant_info.previous_supervisor_phone_number}',
                    '${applicant_info.previous_supervisor_country_code}',
                    '${applicant_info.previous_contact_supervisor}',
                    '${applicant_info.school_college}',
                    '${applicant_info.graduation_year}',
                    '${applicant_info.resume}',
                    '${applicant_info.employment_period}',
                    '${applicant_info.applied_job}',
                    '${firebase_id}',
                    '${true}',
                    'now()'
              )
            RETURNING id as employee_id
            `;
        admin.auth().setCustomUserClaims(userRecord.uid, customClaims);
      } catch (error) {
        context.res = {
          status: 500,
          body: {
            message: error.message,
          },
        };
        return;
      }
      let update_query = updateQuery(applicant, email, type, applicant_info);
      let query = `${update_query} ${make_employee_query}`;
      db.connect();
      result = await db.query(query);
      db.end();
    }
    else {
      let update_query = updateQuery(applicant, email, type, applicant_info);
      let query = `${update_query}`;
      db.connect();
      result = await db.query(query);
      db.end();
    }

    //#region create employee in employee status bar and employee documents if applicant accepts offer
    if (applicant.status_message == 'Results' && applicant.status_step == '12.1') {
      employee_id = result[1].rows[0].employee_id
      let employee_status_bar_query
      try {
        if (applicant_info.country == 'United States of America') {
          employee_status_bar_query = `
          INSERT INTO 
                      "Employee_Status_Bar"
                      (
                        "employee_id",
                        "status_step",
                        "status_message",
                        "step_one_date",	
                        "created_at"
                      )
          VALUES
                      (
                        '${employee_id}',
                        '2',
                        'Account Activated',
                        now(),
                        now()
                      )
          `;
        }
        else if (applicant_info.country != 'United States of America') {
          employee_status_bar_query = `
          INSERT INTO 
                      "H2a_Status_Bar"
                      (
                        "employee_id",
                        "status_step",
                        "status_message",
                        "step_one_date",	
                        "created_at"
                      )
          VALUES
                      (
                        '${employee_id}',
                        '2',
                        'Account Activated',
                        now(),
                        now()
                      )
          `;
        }
        db1.connect();
        let result2 = await db1.query(employee_status_bar_query);
        db1.end()
      } catch (error) {
        db1.end();
        context.res = {
          status: 400,
          body: {
            message: error.message,
          },
        };
        context.done();
        return;
      }
      //Employee Documents 
      try {
        let employee_document_query = `
        INSERT INTO 
                    "Employee_Documents"
                    (
                      "employee_id",	
                      "created_at"
                    )
        VALUES
                    (
                      '${employee_id}',
                      now()
                    )
        `;
        db2.connect();
        let result2 = await db2.query(employee_document_query);
        db2.end()
      } catch (error) {
        db2.end();
        context.res = {
          status: 400,
          body: {
            message: error.message,
          },
        };
        context.done();
        return;
      }
    }
    //#endregion
    //#region Email
    if (email && email.subject && email.to && email.body && !skip_email) {
      let emailBody = email.body.replace('&#8205', '');
      const connectionString = process.env["EMAIL_CONNECTION_STRING"];
      const client = new EmailClient(connectionString);
      const emailMessage: EmailMessage = {
        sender: "recruiter@dht-usa.com",
        content: {
          subject: `${email.subject}`,
          html: `${emailBody}`
        },
        recipients: {
          to: [
            {
              email: `${email.to}`,
            },
          ],
        },
      };

      const messageId: any = await client.send(emailMessage);
    }

    //#endregion
    context.res = {
      status: 200,
      body: {
        message: "Applicant has been updated successfully.",
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



