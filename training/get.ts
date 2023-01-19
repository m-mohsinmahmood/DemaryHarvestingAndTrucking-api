import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const entity = req.query.entity;
    try {
        let query =`
        SELECT * FROM "Training"
        WHERE "is_digital_form_started" = 'TRUE' AND "evaluation_type" = '${entity}'
        ;`
        console.log(query);

        db.connect();

        let result = await db.query(query);

        let resp;
    if (result.rows.length > 0) resp = result.rows[0];
    else
      resp = {
        message: "No Records Found.",
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
