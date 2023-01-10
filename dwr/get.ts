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
        const date: string = req.query.date;
        const dateType: string = req.query.dateType;
        const month: string = req.query.month;
        const year: string = req.query.year;
        console.log('Req:',req.query)

        let employee_info_query: string = '';
        let count_query: string = '';

        if (search_clause === 'beginningOfDay') {
            // Beginning of Day to check if employee has closed a day before selecting another workorder
            employee_info_query = `
        Select * from "DWR" where employee_id = '${employee_id}' And is_day_closed='false' ;
      `;

            count_query = `
        SELECT  COUNT("id") from "DWR" where employee_id = '${employee_id}' And is_day_closed='false' `;
        }
        else if(dateType === 'month'){
            employee_info_query = `
            Select * from "DWR" 
            WHERE employee_id = '${employee_id}' 
            AND is_day_closed='false' 
            AND EXTRACT(MONTH FROM created_at) = '${month}'
            AND EXTRACT(YEAR FROM created_at) = '${year}';
          `;
    
                count_query = `
            SELECT  COUNT("id") from "DWR" 
            WHERE employee_id = '${employee_id}' 
            AND is_day_closed='false' 
            AND EXTRACT(MONTH FROM created_at) = '${month}'
            AND EXTRACT(YEAR FROM created_at) = '${year}';
            `;
        }
        else if (dateType === 'day'){
            console.log('ELSE-CALLED')
             employee_info_query = `
             Select * from "DWR" where employee_id = '${employee_id}' And is_day_closed='false' AND CAST(created_at AS Date) = '${date}' ;
           `;
     
                 count_query = `
             SELECT  COUNT("id") from "DWR" where employee_id = '${employee_id}' And is_day_closed='false' AND CAST(created_at AS Date) = '${date}'`;
        }

        let query = `${employee_info_query} ${count_query}`;

        console.log(query);

        db.connect();

        let result = await db.query(query);

        let resp = {
            workOrders: result[0].rows,
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
