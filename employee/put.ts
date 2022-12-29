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
        UPDATE 
                "Employees"
        SET 
                "first_name"                    = '${employee.first_name}',
                "last_name"                     = '${employee.last_name}',
                "email"                         = '${employee.email}',
                "cell_phone_number"             = '${employee.cell_phone_number}',
                "home_phone_number"             = '${employee.home_phone_number}',
                "date_of_birth"                 = '${employee.date_of_birth}',
                "age"                           = '${employee.age}',
                "marital_status"                = '${employee.marital_status}',
                "languages"                     = '${employee.languages}',
                "rank_speaking_english"         = '${employee.rank_speaking_english}',
                "address_1"                     = '${employee.address_1}',
                "address_2"                     = '${employee.address_2}',
                "town_city"                     = '${employee.town_city}',
                "county_providence"             = '${employee.county_providence}',
                "state"                         = '${employee.state}',
                "postal_code"                   = '${employee.postal_code}',
                "country"                       = '${employee.country}',
                "avatar"                        = '${employee.avatar}',
                "question_1"                    = '${employee.question_1}',
                "question_2"                    = '${employee.question_2}',
                "question_3"                    = '${employee.question_3}',
                "question_4"                    = '${employee.question_4}',
                "question_5"                    = '${employee.question_5}',
                "authorized_to_work"            = '${employee.authorized_to_work}',
                "us_citizen"                    = '${employee.us_citizen}',
                "cdl_license"                   = '${employee.cdl_license}',
                "lorry_license"                 = '${employee.lorry_license}',
                "tractor_license"               = '${employee.tractor_license}',
                "passport"                      = '${employee.passport}',
                "work_experience_description"   = '${employee.work_experience_description}',
                "employment_period"             = '${employee.employment_period}',
                "supervisor_name"               = '${employee.supervisor_name}',
                "supervisor_contact"            = '${employee.supervisor_contact}',
                "degree_name"                   = '${employee.degree_name}',
                "reason_for_applying"           = '${employee.reason_for_applying}',
                "hear_about_dht"                = '${employee.hear_about_dht}',
                "us_phone_number"               = '${employee.us_phone_number}',
                "blood_type"                    = '${employee.blood_type}',
                "emergency_contact_name"        = '${employee.emergency_contact_name}',
                "emergency_contact_phone"       = '${employee.emergency_contact_phone}'
        WHERE 
                "id" = '${employee.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Employee has been updated successfully.",
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
