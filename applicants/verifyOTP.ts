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
          `;

            let result = await db.query(query);

            resp = {
                data: result.rows[0],
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
