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
    const sort: string = req.query.sort ? req.query.sort : `emp.created_at`;
    const order: string = req.query.order ? req.query.order : `desc`;
    const country: string = req.query.country;
    const employment_period: string = req.query.employment_period;
    const year: string = req.query.year;

    let whereClause: string = ` WHERE emp."is_deleted" = FALSE`;

    if (search) whereClause = ` ${whereClause} AND (LOWER("last_name") LIKE LOWER('%${search}%') OR LOWER("first_name") LIKE LOWER('%${search}%'))`;
    if (status) whereClause = ` ${whereClause} AND "status" = ${(status === 'true')}`;
    if (country) whereClause = ` ${whereClause} AND "country" = '${country}'`;
    if (employment_period) whereClause = ` ${whereClause} AND "employment_period" = '${employment_period}'`;
    if (year) whereClause = ` ${whereClause} AND EXTRACT(YEAR from emp.created_at) = '${year}'`;

    if (role) {
      let types = role.split(",");
      types.forEach((type, index) => {
        if (index === 0)
          whereClause = ` ${whereClause} AND ( "role" LIKE '%' || '${type}' || '%'`;
        else if (index > 0)
          whereClause = ` ${whereClause} OR "role" LIKE '%' || '${type}' || '%'`;
      });
      whereClause = ` ${whereClause} )`
    }

    let employee_query = `
        SELECT 
        emp."id",
        "first_name",
        "last_name",
        "role",
        "email",
        "country",
        "employment_period",
        "cell_phone_number",
        "cell_phone_country_code",
        "fb_id",
        "status",
        "status_step",
        "action_required",
        emp."created_at",
        "is_guest_user",
        emp_docs.passport_number, 
        emp_docs.visa_control_number, 
        emp_docs.cert_arrival_date

        FROM 
                
        "Employees" emp
				LEFT JOIN "Employee_Documents" emp_docs ON emp.id = emp_docs.employee_id

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
              COUNT(emp."id")
        FROM 
        
        "Employees" emp
				LEFT JOIN "Employee_Documents" emp_docs ON emp.id = emp_docs.employee_id
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
