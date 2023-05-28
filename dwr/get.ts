import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const employee_id: string = req.query.employeeId;
        const search_clause: string = req.query.searchClause;
        const dwrType: string = req.query.type
        const role = req.query.role;

        console.log('Req:', req.query)

        let employee_info_query: string = '';
        let count_query: string = '';

        if (search_clause === 'beginningOfDay') {
            // Beginning of Day to check if employee has closed a day before selecting another workorder
            employee_info_query = `
        Select * from "DWR" where employee_id = '${employee_id}' And dwr_type='${dwrType}' And is_day_closed='false' ;
      `;

            count_query = `
        SELECT  COUNT("id") from "DWR" where employee_id = '${employee_id}' And dwr_type='${dwrType}' And is_day_closed='false' `;
        }

        else if (search_clause === 'beginningOfDayHarvesting') {
            // Beginning of Day to check if employee has closed a day before selecting another workorder
            let from = ``;
            if (role === 'Combine Operator' || role === 'Cart Operator') {
                from = ` 
                FROM
                "DWR" dwr
                INNER JOIN "Customer_Job_Setup" cjs ON dwr.job_id = cjs."id"
                INNER JOIN "Customer_Farm" farm ON farm."id" = cjs.farm_id
                INNER JOIN "Crops" crop ON crop.ID = cjs.crop_id
                INNER JOIN "Customers" customers ON cjs.customer_id = customers."id"
                INNER JOIN "Employees" crew ON crew."id" = cjs.crew_chief_id
                INNER JOIN "Machinery" machinery ON dwr.machinery_id = machinery."id"	
            
                where employee_id = '${employee_id}' And is_day_closed='false' `;

                employee_info_query = `
                SELECT

                cjs.ID,
                cjs.created_at :: "date",
                customers.ID AS customer_id,
                customers.customer_name,
                crop."id" AS crop_id,
                crop.NAME AS crop_name,
                dwr.machinery_id as machinery_id,
                cjs."state" AS STATE,
                farm."id" AS farm_id,
                farm."name" AS farm_name,
                cjs.crew_chief_id,
                concat ( crew.first_name, ' ', crew.last_name ) AS crew_chief_name,
                machinery.engine_hours,
                machinery.separator_hours	
                ${from}
           ;
      `}

            else if (role === 'Truck Driver') {
                from = ` 
                FROM
                "DWR" dwr
                INNER JOIN "Customer_Job_Setup" cjs ON dwr.job_id = cjs."id"
                INNER JOIN "Customer_Farm" farm ON farm."id" = cjs.farm_id
                INNER JOIN "Crops" crop ON crop.ID = cjs.crop_id
                INNER JOIN "Customers" customers ON cjs.customer_id = customers."id"
                INNER JOIN "Employees" crew ON crew."id" = cjs.crew_chief_id
                INNER JOIN "Motorized_Vehicles" machinery ON dwr.machinery_id = machinery."id"
    
                where employee_id = '${employee_id}' And is_day_closed='false' `;

                employee_info_query = `
                SELECT

                cjs.ID,
                cjs.created_at :: "date",
                customers.ID AS customer_id,
                customers.customer_name,
                crop."id" AS crop_id,
                crop.NAME AS crop_name,
                dwr.machinery_id as machinery_id,
                cjs."state" AS STATE,
                farm."id" AS farm_id,
                farm."name" AS farm_name,
                cjs.crew_chief_id,
                concat ( crew.first_name, ' ', crew.last_name ) AS crew_chief_name,
                machinery.odometer_reading_end
                ${from}
                ;
            `}

            ;

            count_query = `SELECT  COUNT(cjs."id") ${from} ;`;
        }

        let query = `${employee_info_query} ${count_query}`;

        console.log(query);

        await db.connect();

        let result = await db.query(query);

        let resp = {
            workOrders: result[0].rows,
            count: +result[1].rows[0].count
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
