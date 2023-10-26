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
        const customer_type: string = req.query.type;
        const page: number = +req.query.page ? +req.query.page : 1;
        const limit: number = +req.query.limit ? +req.query.limit : 10;
        const sort: string = req.query.sort ? req.query.sort : `cust.created_at`;
        const order: string = req.query.order ? req.query.order : `desc`;
        const portalType: any = req.query.portal_type;
        const employee_id: any = req.query.employee_id;

        let from: string = ``;
        let whereClause: string = `AND cust."is_deleted" = FALSE`;

        if (portalType == 'employee-portal') {
            from = `
      "Customers" cust
      INNER JOIN "Harvesting_Delivery_Ticket" hdt ON hdt.customer_id = cust.ID 
      INNER JOIN "Customer_Job_Setup" cjs ON cjs.id = hdt.job_id
      
      where (
      hdt.kart_operator_id = '${employee_id}' OR hdt.truck_driver_id = '${employee_id}'
      OR cjs.crew_chief_id = '${employee_id}'
      OR cjs.director_id = '${employee_id}')`
        }

        if (search) whereClause = ` ${whereClause} AND LOWER("customer_name") LIKE LOWER('%${search}%')`;
        if (status) whereClause = ` ${whereClause} AND "status" = ${(status === 'true')}`;
        if (customer_type) {
            let types = customer_type.split(",");
            types.forEach((type, index) => {
                if (index === 0)
                    whereClause = ` ${whereClause} AND ( "customer_type" LIKE '%' || '${type}' || '%'`;
                else if (index > 0)
                    whereClause = ` ${whereClause} OR "customer_type" LIKE '%' || '${type}' || '%'`;
            });
            whereClause = ` ${whereClause} )`
        }

        let customer_info_query = `
        SELECT 
              cust."id", 
              "customer_name",
              "main_contact", 
              "position", 
              "phone_number", 
              cust."state", 
              "country", 
              "email", 
              "customer_type", 
              "status"
        FROM 
              ${from}
              ${whereClause}

        GROUP BY cust."id"

        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

        let customer_count_query = `
        SELECT 
              COUNT(cust."id")
        FROM
              ${from}
              ${whereClause}
              GROUP BY cust."id"
              ;
      `;

        let query = `${customer_info_query} ${customer_count_query}`;

        db.connect();

        let result = await db.query(query);

        let resp = {
            customers: result[0].rows,
            count: +result[1]?.rows?.length,
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
