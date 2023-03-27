import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    let machinery_id = req.query.id;
    const search: string = req.query.search;
    const status: string = req.query.status;
    // const customer_type: string = req.query.type;
    // const page: number = +req.query.page ? +req.query.page : 1;
    // const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `createdat` ;
    const order: string = req.query.order ? req.query.order : `desc`;
    let whereClause: string = ` WHERE "equipmentId" = '${machinery_id}' `;

    if (search) whereClause = ` ${whereClause} AND LOWER(name) LIKE LOWER('%${search}%')`;
    // if (status) whereClause = ` ${whereClause} AND "status" = ${(status === 'true')}`;

    let tickets_info_query = `
    SELECT
mr.id,
	mr."state",
	mr."equipmentId",
	mr.description,
	mr."severityType",
	mr.status,
	emp.first_name,
	emp.last_name
FROM
	"Maintenance_Repair" mr
	INNER JOIN "Employees" emp on emp."id" = mr."assignedToId"
    ${whereClause}
        ORDER BY 
              ${sort} ${order};
      `;

    let tickets_count_query = `
        SELECT 
              COUNT("id")
        FROM 
              "Maintenance_Repair"
        ${whereClause};
      `;

    let query = `${tickets_info_query} ${tickets_count_query}`;

    console.log(query);

    db.connect();

    let result = await db.query(query);

    let resp = {
      maintenanceRepair: result[0].rows,
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
