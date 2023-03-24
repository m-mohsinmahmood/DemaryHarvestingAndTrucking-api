import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const to: string = req.query.to;
    const from: string = req.query.from;


    let dateRangeFrom = `'2023-02-07'`;
    let dateRangeTo = `now()`;

    if (from!='' && from != undefined) {
      dateRangeFrom = ` '${from}'`;
    }

    if (to!='' && to != undefined) {
      dateRangeTo = ` '${to}' `;
    }

  try {
    const employee_id: string = req.query.id;

    let payrollQuery = `
    SELECT
	i :: DATE AS "PayPeroidStart",
	( i + '13 days' :: INTERVAL ) :: DATE AS "PayPeriodEnd",

	(
	SELECT SUM
		( dwr.hours_worked :: NUMERIC ) AS total_hours_worked 
	FROM
		"DWR" dwr
		INNER JOIN "Trucking_Delivery_Ticket" tdt ON dwr.delivery_ticket_id = tdt."id"
		INNER JOIN "H2a_Hourly_Rate" hr ON tdt.destination_state = hr."state"
		INNER JOIN "Employees" emp ON dwr.employee_id = emp."id" 
		AND tdt.created_at :: DATE >= i :: DATE 
		AND tdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
		AND employee_id = '${employee_id}' 
	ORDER BY
		total_hours_worked DESC 
		LIMIT 1 
	) 
FROM
generate_series ( ${dateRangeFrom}:: DATE, ${dateRangeTo} :: DATE, '14 days' :: INTERVAL ) AS "i";
`;

  //   let dwr_info_query1 = `
          
  //   SELECT
	// i :: DATE AS "PayPeroidStart",
	// ( i + '13 days' :: INTERVAL ) :: DATE AS "PayPeriodEnd",
	// (
	// SELECT
	// 	tdt."destination_state" as state
	// FROM
	// 	"DWR" dwr
	// 	INNER JOIN "Trucking_Delivery_Ticket" tdt ON dwr."delivery_ticket_id" = tdt."id" 
	// 	AND tdt.created_at :: DATE >= i :: DATE 
	// 	AND tdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
	// 	AND employee_id = '${employee_id}' 
		
	// 	GROUP BY tdt."destination_state"
		
	// ORDER BY
	// 	COUNT ( destination_state ) DESC LIMIT 1
	// ),
	// (
	// SELECT COUNT
	// 	( destination_state ) as state_count
	// FROM
	// 	"DWR" dwr
	// 	INNER JOIN "Trucking_Delivery_Ticket" tdt ON dwr."delivery_ticket_id" = tdt."id" 
	// 	AND tdt.created_at :: DATE >= i :: DATE 
	// 	AND tdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
	// 	AND employee_id = '${employee_id}' 
	// GROUP BY
	// 	tdt."destination_state" 
	// ORDER BY
	// 	COUNT ( destination_state ) DESC LIMIT 1 
	// ),
	// ( 
	// SELECT
	// SUM(dwr.hours_worked::numeric) AS total_hours_worked
	// FROM
  //   "DWR" dwr
  //   INNER JOIN "Trucking_Delivery_Ticket" tdt ON dwr.delivery_ticket_id = tdt."id"
  //   INNER JOIN "H2a_Hourly_Rate" hr ON tdt.destination_state = hr."state"
  //   INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
	// 	AND tdt.created_at :: DATE >= i :: DATE 
	// 	AND tdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
		
	// 	AND employee_id = '${employee_id}' 

	// 	ORDER BY
	// 	total_hours_worked DESC LIMIT 1 
	// ),
	// (
	// SELECT
	// SUM( CAST(dwr.hours_worked as FLOAT) *  CAST(hr.hourly_rate as FLOAT) ) AS wage
	// FROM
  //   "DWR" dwr
  //   INNER JOIN "Trucking_Delivery_Ticket" tdt ON dwr.delivery_ticket_id = tdt."id"
  //   INNER JOIN "H2a_Hourly_Rate" hr ON tdt.destination_state = hr."state"
  //   INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
	// 	AND tdt.created_at :: DATE >= i :: DATE 
	// 	AND tdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
		
	// 	AND employee_id = '${employee_id}' 
	// 	GROUP BY
	// 	dwr.hours_worked
	// 	ORDER BY
	// 	wage DESC LIMIT 1
	// )
	
	// FROM
	// generate_series ( ${dateRangeFrom}:: DATE, ${dateRangeTo} :: DATE, '14 days' :: INTERVAL ) AS "i";
  //     `;
  //     let dwr_info_query2 = `
          
  //     SELECT
  //     i :: DATE AS "PayPeroidStart",
  //     ( i + '13 days' :: INTERVAL ) :: DATE AS "PayPeriodEnd",
  //     (
  //     SELECT
  //       fwo."state" as state
  //     FROM
  //       "DWR" dwr
  //       INNER JOIN "Farming_Work_Order" fwo ON dwr."delivery_ticket_id" = fwo."id" 
  //       AND fwo.created_at :: DATE >= i :: DATE 
  //       AND fwo.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
  //       AND employee_id = '${employee_id}' 
        
  //       GROUP BY fwo."state"
        
  //     ORDER BY
  //       COUNT ( fwo."state" ) DESC LIMIT 1
  //     ),
  //     (
  //     SELECT COUNT
  //       ( fwo."state" ) as state_count
  //     FROM
  //       "DWR" dwr
  //       INNER JOIN "Farming_Work_Order" fwo ON dwr."delivery_ticket_id" = fwo."id" 
  //       AND fwo.created_at :: DATE >= i :: DATE 
  //       AND fwo.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
  //       AND employee_id = '${employee_id}'  
  //     GROUP BY
  //       fwo."state"
  //     ORDER BY
  //       COUNT ( fwo."state" ) DESC LIMIT 1 
  //     ),
  //     ( 
  //     SELECT
  //     SUM(dwr.hours_worked::numeric) AS total_hours_worked
  //     FROM
  //       "DWR" dwr
  //       INNER JOIN "Farming_Work_Order" fwo ON dwr."delivery_ticket_id" = fwo."id" 
  //       INNER JOIN "H2a_Hourly_Rate" hr ON fwo."state" = hr."state"
  //       INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
  //       AND fwo.created_at :: DATE >= i :: DATE 
  //       AND fwo.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
        
  //       AND employee_id = '${employee_id}' 
    
  //       ORDER BY
  //       total_hours_worked DESC LIMIT 1 
  //     ),
  //     (
  //     SELECT
  //     SUM( CAST(dwr.hours_worked as FLOAT) *  CAST(hr.hourly_rate as FLOAT) ) AS wage 
  //     FROM
  //       "DWR" dwr
  //       INNER JOIN "Farming_Work_Order" fwo ON dwr."delivery_ticket_id" = fwo."id" 
  //       INNER JOIN "H2a_Hourly_Rate" hr ON fwo."state" = hr."state"
  //       INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
  //       AND fwo.created_at :: DATE >= i :: DATE 
  //       AND fwo.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
        
  //       AND employee_id = '${employee_id}' 
  //       GROUP BY
  //       dwr.hours_worked
  //       ORDER BY
  //       wage DESC LIMIT 1
  //     )
      
  //     FROM
  //     generate_series ( ${dateRangeFrom}:: DATE, ${dateRangeTo} :: DATE, '14 days' :: INTERVAL ) AS "i";
  //     `;
  //     let dwr_info_query3 = `
          
  //     SELECT
	// i :: DATE AS "PayPeroidStart",
	// ( i + '13 days' :: INTERVAL ) :: DATE AS "PayPeriodEnd",
	// (
	// SELECT
	// 	hdt."state" as state
	// FROM
	// 	"DWR" dwr
	// INNER JOIN "Harvesting_Delivery_Ticket" hdt ON dwr.work_order_id = hdt."id"
	// 	AND hdt.created_at :: DATE >= i :: DATE 
	// 	AND hdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
	// 	AND employee_id = '${employee_id}'
		
	// 	GROUP BY hdt."state"
		
	// ORDER BY
	// 	COUNT ( hdt."state" ) DESC LIMIT 1
	// ),
	// (
	// SELECT COUNT
	// 	( hdt."state" ) as state_count
	// FROM
	// 	"DWR" dwr
	// INNER JOIN "Harvesting_Delivery_Ticket" hdt ON dwr.work_order_id = hdt."id"
	// 	AND hdt.created_at :: DATE >= i :: DATE 
	// 	AND hdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
	// 	AND employee_id = '${employee_id}' 
	// GROUP BY
	// 	hdt."state"
	// ORDER BY
	// 	COUNT ( hdt."state" ) DESC LIMIT 1 
	// ),
	// ( 
	// SELECT
	// SUM(dwr.hours_worked::numeric) AS total_hours_worked
	// FROM
  //   "DWR" dwr
	// INNER JOIN "Harvesting_Delivery_Ticket" hdt ON dwr.work_order_id = hdt."id"
	// INNER JOIN "H2a_Hourly_Rate" hr ON hdt."state" = hr."state"
  //   INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
	// 	AND hdt.created_at :: DATE >= i :: DATE 
	// 	AND hdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
		
	// 	AND employee_id = '${employee_id}'

	// 	ORDER BY
	// 	total_hours_worked DESC LIMIT 1 
	// ),
	// (
	// SELECT
	// SUM( CAST(dwr.hours_worked as FLOAT) *  CAST(hr.hourly_rate as FLOAT) ) AS wage 
	// FROM
  //   "DWR" dwr
	// INNER JOIN "Harvesting_Delivery_Ticket" hdt ON dwr.work_order_id = hdt."id"
	// INNER JOIN "H2a_Hourly_Rate" hr ON hdt."state" = hr."state"
	// INNER JOIN "Employees" emp ON dwr.employee_id = emp."id"
	// 	AND hdt.created_at :: DATE >= i :: DATE 
	// 	AND hdt.created_at :: DATE <= ( i + '13 days' :: INTERVAL ) :: DATE 
		
	// 	AND employee_id = '${employee_id}'
	// 	GROUP BY
	// 	dwr.hours_worked
	// 	ORDER BY
	// 	wage DESC LIMIT 1
	// )
	
	// FROM
	// generate_series ( ${dateRangeFrom}:: DATE, ${dateRangeTo} :: DATE, '14 days' :: INTERVAL ) AS "i";
  //     `;

    

    let query = `${payrollQuery}`;
    console.log(query);

    db.connect();

    let result = await db.query(query);
    // let payrollPeriodsList = [];
    // payrollPeriodsList.push(result[0].rows);
    // payrollPeriodsList.push(result[1].rows);
    // payrollPeriodsList.push(result[2].rows);

    let resp = {
      payrollPeriod: result.rows
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
