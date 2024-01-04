import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const email: string = req.query.email;
        const otp: string = req.query.otp;

        let query = `
        Select generated_otp
        from "Applicants" where email = '${email}';
      `;

        db.connect();

        let result = await db.query(query);
        let otpToCompare = result.rows[0].generated_otp;

        let resp;

        if (otpToCompare == otp) {
            let query = `
            Select id, Concat(first_name, ' ' , last_name) AS name, email
            from "Applicants" where email = '${email}';

            Select id, Concat(first_name, ' ' , last_name) AS name, email
            from "Employees" where email = '${email}';
          `;

            let result = await db.query(query);

            query = `
            UPDATE 
                "Applicants"
            SET 
                "first_call_remarks"            = NULL,
                "first_call_ranking"            = NULL,
                "first_interviewer_id"          = NULL,
                "reference_call_remarks"        = NULL,
                "reference_call_ranking"        = NULL,
                "reference_interviewer_id"      = NULL,
                "second_call_remarks"           = NULL,
                "second_call_ranking"           = NULL,
                "second_interviewer_id"         = NULL,
                "third_call_remarks"            = NULL,
                "third_call_ranking"            = NULL,
                "third_interviewer_id"          = NULL,
                "status_step"                   = '2',
                "status_message"                = 'Preliminary Review',
                "step_one_status_date"          = NULL,
                "step_two_status_date"          = NULL,
                "step_three_status_date"        = NULL,
                "step_four_status_date"         = NULL,
                "step_five_status_date"         = NULL,
                "step_six_status_date"          = NULL,
                "step_seven_status_date"        = NULL,
                "step_eight_status_date"        = NULL,
                "step_nine_status_date"         = NULL,
                "step_ten_status_date"          = NULL,
                "step_eleven_status_date"       = NULL,
                "step_twelve_status_date"       = NULL,
                "step_thirteen_status_date"     = NULL,
                "reason_for_rejection"          = NULL,
                "ranking"                       = '0.00',
                "previous_status_message"       = 'Application Submitted',
                "created_at"                    = 'now()',
                "modified_at"                   = NULL

             where email = '${email}';
          `
            let dataWipeOut = await db.query(query);


            resp = {
                data: result[0].rows[0],
                otpVerified: true
            }
        }
        else
            resp = {
                data: "OTP is wrong.",
                otpVerified: false
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
