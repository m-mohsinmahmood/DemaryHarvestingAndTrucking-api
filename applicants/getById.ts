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
            "status",
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
            "first_phone_call",
            "first_call_remarks",
            "reference_phone_call",
            "reference_call_remarks",
            "second_phone_call",
            "second_call_remarks",
            "third_phone_call",
            "third_call_remarks"
    FROM 
            "Applicants"
    WHERE 
              "id" = '${applicant_id}';
      `;

    db.connect();

    let result = await db.query(applicant_query);
    let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No applicant exists with this id.",
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
