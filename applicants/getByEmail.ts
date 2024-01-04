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

        let query = `
            Select id, Concat(first_name, ' ' , last_name) AS name, email
            from "Applicants" where email = '${email}';
      `;

        db.connect();

        let result = await db.query(query);
        let resp;

        if (result.rows.length > 0) {
            resp = {
                data: result.rows[0],
                emailExisted: true
            }
        }
        else {
            resp = {
                data: "No applicant found with this email.",
                emailExisted: false
            };
        }

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
