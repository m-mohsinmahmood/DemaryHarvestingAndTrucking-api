import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const db = new Client(config);
    let whereClause: string = ` WHERE "is_deleted" = FALSE`;

    try {
        const id: string = req.query.id;
        let policy_doc_query = `
        SELECT 
                *
        FROM 
                "Policy_Documents"
        ${whereClause}
      `;

        let query = `${policy_doc_query}`;
        db.connect();
        let result = await db.query(query);
        let resp = {
            policy_docs: result.rows,
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
