import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { applicant } from "./model";

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
                "calendar_year",
                "languages",
                "date_of_birth",
                "marital_status",
                "address_1",
                "address_2",
                "postal_code",
                "country",
                "county",
                "city",
                "self_rating",
                "us_citizen",
                "tractor_license",
                "passport",
                "avatar",
                "resume",
                "question_1",
                "question_2",
                "question_3",
                "question_4",
                "question_5",
                "work_experience_description",
                "recent_job",
                "supervisor",
                "supervisor_contact",
                "degree_name",
                "institute_name",
                "education",
                "blood_group",
                "reason_for_applying",
                "status_step",
                "status_message"
                )
      VALUES      
                (
                  '${applicant.first_name}',
                  '${applicant.last_name}',
                  '${applicant.email}',
                  '${applicant.cell_phone_number}',
                  '${applicant.home_phone_number}',
                  '${applicant.calendar_year}',
                  '${applicant.languages}',
                  '${applicant.date_of_birth}',
                  '${applicant.marital_status}',
                  '${applicant.address_1}',
                  '${applicant.address_2}',
                  '${applicant.postal_code}',
                  '${applicant.country}',
                  '${applicant.county}',
                  '${applicant.city}',
                  '${applicant.self_rating}',
                  '${applicant.us_citizen}',
                  '${applicant.tractor_license}',
                  '${applicant.passport}',
                  '${applicant.avatar}',
                  '${applicant.resume}',
                  '${applicant.question_1}',
                  '${applicant.question_2}',
                  '${applicant.question_3}',
                  '${applicant.question_4}',
                  '${applicant.question_5}',
                  '${applicant.work_experience_description}',
                  '${applicant.recent_job}',
                  '${applicant.supervisor}',
                  '${applicant.supervisor_contact}',
                  '${applicant.degree_name}',
                  '${applicant.institute_name}',
                  '${applicant.education}',
                  '${applicant.blood_group}',
                  '${applicant.reason_for_applying}',
                  '1',
                  'Applicant Completed'
                );
    `;

    db.connect();
    await db.query(query);
    db.end();

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
