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
            "id",
            "first_name",
            "last_name",
            "role",
            "status",
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
            "degree_name",
            "reason_for_applying",
            "hear_about_dht",
            "us_phone_number",
            "blood_type",
            "emergency_contact_name",
            "emergency_contact_phone"
        FROM 
              "Employees"
        WHERE 
              "id" = '${employee_id}';
      `;

    db.connect();

    let result = await db.query(employee_info_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No customer exists with this id.",
      };

    db.end();

    context.res = {
      status: 200,
      body: resp,
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
