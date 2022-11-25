import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { applicant } from "./model";
const sgMail = require('@sendgrid/mail')

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const applicant: applicant = req.body;

    let query = `
    INSERT INTO 
                "Applicants" 
                (
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
                  "status_step",
                  "status_message",
                  "created_at"
                )
      VALUES      
                (
                  '${applicant.first_name}',
                  '${applicant.last_name}',
                  '${applicant.email}',
                  '${applicant.cell_phone_number}',
                  '${applicant.home_phone_number}',
                  '${applicant.date_of_birth}',
                  '${applicant.age}',
                  '${applicant.marital_status}',
                  '${applicant.languages}',
                  '${applicant.rank_speaking_english}',
                  '${applicant.address_1}',
                  '${applicant.address_2}',
                  '${applicant.town_city}',
                  '${applicant.county_providence}',
                  '${applicant.state}',
                  '${applicant.postal_code}',
                  '${applicant.country}',
                  '${applicant.avatar}',
                  '${applicant.question_1}',
                  '${applicant.question_2}',
                  '${applicant.question_3}',
                  '${applicant.question_4}',
                  '${applicant.question_5}',
                  '${applicant.authorized_to_work}',
                  '${applicant.us_citizen}',
                  '${applicant.cdl_license}',
                  '${applicant.lorry_license}',
                  '${applicant.tractor_license}',
                  '${applicant.passport}',
                  '${applicant.work_experience_description}',
                  '${applicant.employment_period}',
                  '${applicant.supervisor_name}',
                  '${applicant.supervisor_contact}',
                  '${applicant.degree_name}',
                  '${applicant.reason_for_applying}',
                  '${applicant.hear_about_dht}',
                  '${applicant.us_phone_number}',
                  '${applicant.blood_type}',
                  '${applicant.emergency_contact_name}',
                  '${applicant.emergency_contact_phone}',
                  '2',
                  'Advance Preliminary Review',
                  'now()'
                );
    `;

    db.connect();
    await db.query(query);
    db.end();

    
    sgMail.setApiKey('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');
    const msg = {
      to: `${applicant.email}`, 
      from: 'momin4073@gmail.com',
      subject: 'DHT Employment Application Received!',
      html: `Dear ${applicant.first_name} ${applicant.last_name} ,</br> Thank you for your completing DHT’s online application.  We are currently reviewing your application and will be reaching out soon with further instructions on next steps. 
            </br>Thanks
            "</br>Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/matt_dht-usa/interview-teams",
            "</br>Click here to schedule an interview using Zoom:  https://calendly.com/matt_dht-usa/interview-zoom",
            "</br>Click here to schedule an interview using Phone:  https://calendly.com/matt_dht-usa/interview-phone-1"`
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    context.res = {
      status: 200,
      body: {
        message: "Your form has been submitted successfully.",
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
