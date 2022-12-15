import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const search: string = req.query.search;
    const status: string = req.query.status;
    const role: string = req.query.role;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `created_at` ;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = ` WHERE "is_deleted" = FALSE`;

    if (search) whereClause = ` ${whereClause} AND LOWER("last_name") LIKE LOWER('%${search}%')`;
    if (status) whereClause = ` ${whereClause} AND "status" = ${(status === 'true')}`;
    if (role) {
      let types = role.split(",");
      types.forEach((type, index) => {
        if(index === 0)
          whereClause = ` ${whereClause} AND ( "role" LIKE '%' || '${type}' || '%'`;
        else if (index > 0)  
          whereClause = ` ${whereClause} OR "role" LIKE '%' || '${type}' || '%'`;
      });
      whereClause = ` ${whereClause} )`
    }

    let employee_query = `
        SELECT 
                "id",
                "first_name",
                "last_name",
                "role",
                "email",  
                "cell_phone_number",
                "us_phone_number",
                "status",
                "created_at"
        FROM 
                "Employees"
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

    let employee_count_query = `
        SELECT 
              COUNT("id")
        FROM 
              "Employees"
        ${whereClause};
      `;

    let query = `${employee_query} ${employee_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      employees: result[0].rows,
      count: +result[1].rows[0].count,
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
