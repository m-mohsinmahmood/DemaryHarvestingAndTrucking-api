import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const role = req.query.role;
    const employeeId = req.query.employeeId
    let query = ``;

    try {
        if (role === 'Crew Chief') {
            query = `
            SELECT
            cjs.created_at :: "date",
            cjs.ID AS job_id,
            customers."id" AS customer_id,
            concat ( customers.customer_name ) AS customer_name,
            cjs."state",
            farm."id" AS farm_id,
            farm."name" AS farm_name,
            crop."id" AS crop_id,
            crop."name" as crop_name,
            cjs.crew_chief_id as crew_chief_id,
            concat(crew_chief.first_name, ' ', crew_chief.last_name) as crew_chief_name,
            cjs.job_setup_name
        
            FROM
            "Customer_Job_Setup" cjs
            
            INNER JOIN "Employees" crew_chief ON crew_chief."id" = cjs.crew_chief_id
            INNER JOIN "Customers" customers ON cjs.customer_id = customers."id"
            INNER JOIN "Customer_Farm" farm ON cjs.farm_id = farm."id"
            INNER JOIN "Crops" crop ON cjs.crop_id = crop.ID 
        
            WHERE
            cjs.crew_chief_id = '${employeeId}'
            AND cjs.is_job_active = TRUE
            AND cjs.is_job_completed = FALSE
        ;`;

            await db.connect();
            let result = await db.query(query);
            let resp = {
                jobs: result.rows
            };

            context.res = {
                status: 200,
                body: resp
            };
        }

        else if (role === 'Combine Operator' || role === 'Cart Operator') {
            query = `
            SELECT
            cjs.created_at :: "date",
            cjs.ID AS job_id,
            customers."id" AS customer_id,
            concat ( customers.customer_name ) AS customer_name,
            cjs."state",
            farm."id" AS farm_id,
            farm."name" AS farm_name,
            crop."id" AS crop_id,
            crop."name" AS crop_name,
            cjs.crew_chief_id AS crew_chief_id,
            concat ( crew_chief.first_name, ' ', crew_chief.last_name ) AS crew_chief_name,
            job_setup_name 
            
            FROM
            "Customer_Job_Setup" cjs
            
            INNER JOIN "Employees" crew_chief ON crew_chief."id" = cjs.crew_chief_id
            INNER JOIN "Customers" customers ON cjs.customer_id = customers."id"
            INNER JOIN "Customer_Farm" farm ON cjs.farm_id = farm."id"
            INNER JOIN "Crops" crop ON cjs.crop_id = crop.ID 
            
            WHERE
            cjs.crew_chief_id :: VARCHAR = ( SELECT dht_supervisor_id :: VARCHAR FROM "Employees" WHERE ID = '${employeeId}' ) 
            AND cjs.is_job_active = TRUE 
            AND cjs.is_job_completed = FALSE
        ;`;

            await db.connect();
            let result = await db.query(query);
            let resp = {
                jobs: result.rows
            };

            context.res = {
                status: 200,
                body: resp
            };
        }

        else if (role === 'Truck Driver') {
            query = `
            select dht_supervisor_id from "Employees" where id = '${employeeId}' ;`;

            await db.connect();
            let result = await db.query(query);
            let CartOperator = result.rows[0].dht_supervisor_id;

            let customer_id = req.query.customer_id_filter;
            let state = req.query.state_filter;
            let whereClause = ``;

            if(customer_id != null && customer_id != ''){
                whereClause += `AND cjs.customer_id = '${customer_id}'`;
            }

            if(state != null && state != ''){
                whereClause += `AND cjs.state = '${state}'`;
            }

            query = `SELECT
            cjs.created_at :: "date",
            cjs.ID AS job_id,
            customers."id" AS customer_id,
            concat ( customers.customer_name ) AS customer_name,
            cjs."state",
            farm."id" AS farm_id,
            farm."name" AS farm_name,
            crop."id" AS crop_id,
            crop."name" AS crop_name,
            cjs.crew_chief_id AS crew_chief_id,
            concat ( crew_chief.first_name, ' ', crew_chief.last_name ) AS crew_chief_name, 
            job_setup_name 
            
            FROM
            "Customer_Job_Setup" cjs
            
            INNER JOIN "Employees" crew_chief ON crew_chief."id" = cjs.crew_chief_id
            INNER JOIN "Customers" customers ON cjs.customer_id = customers."id"
            INNER JOIN "Customer_Farm" farm ON cjs.farm_id = farm."id"
            INNER JOIN "Crops" crop ON cjs.crop_id = crop.ID 
            
            WHERE
            -- cjs.crew_chief_id :: VARCHAR = ( SELECT dht_supervisor_id :: VARCHAR FROM "Employees" WHERE ID = '${CartOperator}' ) 
            cjs.is_job_active = TRUE 
            AND cjs.is_job_completed = FALSE
            ${whereClause}
            
            ;`;

            result = await db.query(query);

            let resp = {
                jobs: result.rows
            };

            context.res = {
                status: 200,
                body: resp
            };
        }

    } catch (err) {
        context.res = {
            status: 500,
            body: err,
        };
    }

    finally {
        db.end();
        context.done();
    }
};

export default httpTrigger;
