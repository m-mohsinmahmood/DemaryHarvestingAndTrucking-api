import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { employee } from "./model";
const sgMail = require('@sendgrid/mail')

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee: employee = req.body;

    let query = `
    INSERT INTO 
                "Employees" 
                (
                  "first_name",
                  "last_name",
                  "role",
                  "email",
                  "cell_phone_number",
                  "home_phone_number",
                  "status",
                  "date_of_birth",
                  "age",
                  "marital_status",
                  "languages",
                  "rank_speaking_english",
                  "address_1",
                  "address_2",
                  "town_city",
                  "county_province",
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
                  "created_at"
                )
      VALUES      
                (
                  '${employee.first_name}',
                  '${employee.last_name}',
                  '${employee.role}',
                  '${employee.email}',
                  '${employee.cell_phone_number}',
                  '${employee.home_phone_number}',
                  '${employee.status}',
                  '${employee.date_of_birth}',
                  '${employee.age}',
                  '${employee.marital_status}',
                  '${employee.languages}',
                  '${employee.rank_speaking_english}',
                  '${employee.address_1}',
                  '${employee.address_2}',
                  '${employee.town_city}',
                  '${employee.county_province}',
                  '${employee.state}',
                  '${employee.postal_code}',
                  '${employee.country}',
                  '${employee.avatar}',
                  '${employee.question_1}',
                  '${employee.question_2}',
                  '${employee.question_3}',
                  '${employee.question_4}',
                  '${employee.question_5}',
                  '${employee.authorized_to_work}',
                  '${employee.us_citizen}',
                  '${employee.cdl_license}',
                  '${employee.lorry_license}',
                  '${employee.tractor_license}',
                  '${employee.passport}',
                  '${employee.work_experience_description}',
                  '${employee.employment_period}',
                  '${employee.supervisor_name}',
                  '${employee.supervisor_contact}',
                  '${employee.degree_name}',
                  '${employee.reason_for_applying}',
                  '${employee.hear_about_dht}',
                  '${employee.us_phone_number}',
                  '${employee.blood_type}',
                  '${employee.emergency_contact_name}',
                  '${employee.emergency_contact_phone}',
                  'now()'
                );
    `;

    db.connect();
    await db.query(query);
    db.end();

    
    // sgMail.setApiKey('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');
    // const msg = {
    //   to: `${applicant.email}`, 
    //   from: 'momin4073@gmail.com',
    //   subject: 'DHT Employment Application Received!',
    //   html: `
    //         Dear ${applicant.first_name} ${applicant.last_name},
    //         <br> <br>Thank you for completing DHT’s online application. We are currently reviewing your application and will be reaching out soon with further instructions on next steps. 
    //         <br> <br>Thanks
    //         `
    // }
    // sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log('Email sent')
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //   })

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
