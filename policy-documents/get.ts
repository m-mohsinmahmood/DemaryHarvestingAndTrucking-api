import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const db = new Client(config);
    const db1 = new Client(config);
    const type: string = req.query.type;
    const id: string = req.query.id;
    const employee_id: string = req.query.employee_id;
    const category: string = req.query.category;
    let whereClause: string = '';
    let employeeWhereClause: string = '';

    whereClause = ` WHERE "is_deleted" = FALSE`;
    whereClause = `${whereClause} AND  "document_type" = '${type}'`;
    if (id) whereClause = `${whereClause} AND "employee_id" = '${id}'`;
    if (category) whereClause = `${whereClause} AND "category"= '${category}'`;
    employee_id? employeeWhereClause = `WHERE "id" = '${employee_id}'` : employeeWhereClause = `WHERE "id" = '${id}'`

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
        let policy_resp = {
            policy_docs: result.rows,
        };

        db.end();

        if (id || employee_id) {
            try {
                let employee_query = `
                    SELECT  
                        employment_period
                    FROM
                        "Employees"
                    ${employeeWhereClause}                    
                `;
                db1.connect();
                let result = await db1.query(employee_query);
                let employee_resp = {
                    employment_period: result.rows[0].employment_period,
                }
                let resp = {
                    ...policy_resp,
                    ...employee_resp
                }
                context.res = {
                    status: 200,
                    body: resp,
                };
                context.done();
                return;
            }
            catch (err) {
                db1.end();
                context.res = {
                    status: 500,
                    body: err,
                };
                context.done();
                return;
            }
        }
        else {
            let resp = {
                ...policy_resp,
            }
            context.res = {
                status: 200,
                body: resp,
            };
            context.done();
            return;
        }
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
