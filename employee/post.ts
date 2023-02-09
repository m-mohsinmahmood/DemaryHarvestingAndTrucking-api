import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { employee } from "./model";

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
                  "status_message",
                  "unique_fact",
                  "current_employer",
                  "current_position_title",
                  "current_description_of_role",
                  "current_employment_period_start", 
                  "current_employment_period_end",
                  "current_supervisor_reference",
                  "current_supervisor_phone_number",
                  "current_contact_supervisor",
                  "previous_employer",
                  "previous_position_title",
                  "previous_description_of_role",
                  "previous_employment_period_start",
                  "previous_employment_period_end",
                  "previous_supervisor_reference",
                  "previous_supervisor_phone_number",
                  "previous_contact_supervisor",
                  "school_college",
                  "graduation_year",
                  "resume",
                  "employment_period",
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
                  '${employee.county_providence}',
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
                  '${employee.degree_name}',
                  '${employee.reason_for_applying}',
                  '${employee.hear_about_dht}',
                  '2',
                  'Account activated',
                  '${employee.unique_fact}',
                  '${employee.current_employer}',
                  '${employee.current_position_title}',
                  '${employee.current_description_of_role}',
                  '${employee.current_employment_period_start}',
                  '${employee.current_employment_period_end}',
                  '${employee.current_supervisor_reference}',
                  '${employee.current_supervisor_phone_number}',
                  '${employee.current_contact_supervisor}',
                  '${employee.previous_employer}',
                  '${employee.previous_position_title}',
                  '${employee.previous_description_of_role}',
                  '${employee.previous_employment_period_start}',
                  '${employee.previous_employment_period_end}',
                  '${employee.previous_supervisor_reference}',
                  '${employee.previous_supervisor_phone_number}',
                  '${employee.previous_contact_supervisor}',
                  '${employee.school_college}',
                  '${employee.graduation_year}',
                  '${employee.resume}',
                  '${employee.employment_period}',
                  'now()'
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
