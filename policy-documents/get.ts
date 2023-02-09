import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const db = new Client(config);
    const type : string = req.query.type;
    const id   : string = req.query.id;
    let whereClause: string = '';
    
    whereClause = ` WHERE "is_deleted" = FALSE`;
    whereClause = `${whereClause} AND  "document_type" = '${type}'`;
    if (id) whereClause = `${whereClause} AND "employee_id" = '${id}'`;

    try {
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
