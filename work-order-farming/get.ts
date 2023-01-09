import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    const search: string = req.query.search;
    const searchClause: string = req.query.searchClause;
    const employeeId: string = req.query.employeeId;
    
    let whereClause: string = `wo."is_deleted" = FALSE`;

    if (search) whereClause = ` ${whereClause}  AND LOWER(c."customer_name") LIKE LOWER('%${search}%')`;
    try {
        // const customer_field_id: string = req.query.id;
        let queryGetCustomers = ``;
        let count_query = ``;

        //////////////////////////////////////////////////////
        // If we make a call from Beginning of Day Work Order
        if (searchClause === 'beginningOfDay') {
            queryGetCustomers = `
            SELECT * FROM "Farming_Work_Order" where (work_order_status = '' Or work_order_status = 'sent' Or work_order_status IS NULL ) AND (is_active=false AND complete_information=TRUE);`;

            count_query = `
            SELECT  COUNT("id") FROM "Farming_Work_Order" where (work_order_status = '' Or work_order_status = 'sent' Or work_order_status IS NULL ) AND (is_active=false AND complete_information=TRUE);`;
        }


        //////////////////////////////////////////////////////
        // If we make a call from Farming (Dispatcher) Verify Work Orders Work Order
        if (searchClause === 'pending_work_order') {
            queryGetCustomers = `
            SELECT 
            wo."id" AS "work_order_id", 
            wo."created_at" AS "date", 
            wo."service" AS "service", 
            c."id" AS "customer_id", 
            wo."total_service_acres" AS "acres_completed", 
            wo."ending_engine_hours" AS "ending_engine_hours", 
            c."customer_name" AS "customer_name",
            c."phone_number" AS "customer_phone",
            wo."field_address" AS "address",
            wo."dispatcher_id" AS "dispatcher_id",
            tractor."id" AS "tractor_driver_id",
            wo."total_gps-service-acres" AS "gps_acres", 
            "emp".first_name AS "dispatcher_name",
			tractor."first_name" AS "tractor_driver_name",
            "farm".name AS "farm_name",
            "field".name AS "field_name"
			
                     
            FROM 
            "Farming_Work_Order" wo
            INNER JOIN "Customers" c 
            ON wo."customer_id" = c."id" 
                                     
            INNER JOIN "Customer_Farm" farm
            ON "farm".id = wo.farm_id 
                    
            INNER JOIN "Customer_Field" field
            ON "field".id = wo.field_id 
						
			INNER JOIN "Employees" emp
            ON "emp".id = wo.dispatcher_id AND emp."role" = 'Dispatcher'
						
			INNER JOIN "Employees" tractor
            ON "tractor".id = wo.tractor_driver_id AND tractor."role" = 'Tractor Driver'
						
    
            Where wo.work_order_is_completed = True  AND 
            "work_order_status" = 'pending' And "work_order_close_out"=True And

            ${whereClause}
            ORDER BY 
            c."customer_name" ASC;
          `;


            count_query = `
            SELECT 
            COUNT(wo."id")   
   
            FROM 
            "Farming_Work_Order" wo
            INNER JOIN "Customers" c 
            ON wo."customer_id" = c."id" 
                                     
            INNER JOIN "Customer_Farm" farm
            ON "farm".id = wo.farm_id 
                    
            INNER JOIN "Customer_Field" field
            ON "field".id = wo.field_id 
						
			INNER JOIN "Employees" emp
            ON "emp".id = wo.dispatcher_id AND emp."role" = 'Dispatcher'
						
			INNER JOIN "Employees" tractor
            ON "tractor".id = wo.tractor_driver_id AND tractor."role" = 'Tractor Driver'
    
            Where wo.work_order_is_completed = True  AND 
            "work_order_status" = 'pending' And "work_order_close_out"=True And
                    ${whereClause};`;
        }

        //////////////////////////////////////////////////////
        // If we make a call from Farming (Dispatcher) Verify Work Orders Work Order
        if (searchClause === 'verified_work_order') {
            queryGetCustomers = `
            SELECT 
            wo."id" AS "work_order_id", 
            wo."created_at" AS "date", 
            wo."service" AS "service", 
            c."id" AS "customer_id", 
            wo."total_service_acres" AS "acres_completed", 
            wo."ending_engine_hours" AS "ending_engine_hours", 
            c."customer_name" AS "customer_name",
            c."phone_number" AS "customer_phone",
            wo."field_address" AS "address",
            wo."dispatcher_id" AS "dispatcher_id",
            tractor."id" AS "tractor_driver_id",
            wo."total_gps-service-acres" AS "gps_acres", 
            "emp".first_name AS "dispatcher_name",
			tractor."first_name" AS "tractor_driver_name",
            "farm".name AS "farm_name",
            "field".name AS "field_name"
                     
            FROM 
            "Farming_Work_Order" wo
            INNER JOIN "Customers" c 
            ON wo."customer_id" = c."id" 
                                     
            INNER JOIN "Customer_Farm" farm
            ON "farm".id = wo.farm_id 
                    
            INNER JOIN "Customer_Field" field
            ON "field".id = wo.field_id 
						
			INNER JOIN "Employees" emp
            ON "emp".id = wo.dispatcher_id AND emp."role" = 'Dispatcher'
						
			INNER JOIN "Employees" tractor
            ON "tractor".id = wo.tractor_driver_id AND tractor."role" = 'Tractor Driver'
    
            Where wo.work_order_is_completed = True  AND 
            "work_order_status" = 'verified' And "work_order_close_out"=True And

            ${whereClause}
            ORDER BY 
            c."customer_name" ASC;
          `;


            count_query = `
            SELECT 
            COUNT(wo."id")   
   
            FROM 
            "Farming_Work_Order" wo
            INNER JOIN "Customers" c 
            ON wo."customer_id" = c."id" 
                                     
            INNER JOIN "Customer_Farm" farm
            ON "farm".id = wo.farm_id 
                    
            INNER JOIN "Customer_Field" field
            ON "field".id = wo.field_id 
						
			INNER JOIN "Employees" emp
            ON "emp".id = wo.dispatcher_id AND emp."role" = 'Dispatcher'
						
			INNER JOIN "Employees" tractor
            ON "tractor".id = wo.tractor_driver_id AND tractor."role" = 'Tractor Driver'
    
            Where wo.work_order_is_completed = True  AND 
            "work_order_status" = 'verified' And "work_order_close_out"=True And
                    ${whereClause};`;
        }

        //////////////////////////////////////////////////////
        // If we make a call from Farming (Dispatcher) Verify Work Orders Work Order
        if (searchClause === 'sent_work_order') {
            queryGetCustomers = `
            SELECT 
            wo."id" AS "work_order_id", 
            wo."created_at" AS "date", 
            wo."service" AS "service", 
            wo."farm_id" AS "farm_id", 
            wo."field_id" AS "field_id", 
            c."id" AS "customer_id", 
            wo."total_service_acres" AS "acres_completed", 
            wo."ending_engine_hours" AS "ending_engine_hours", 
            c."customer_name" AS "customer_first_name",
            wo."customer_phone" AS "customer_phone",
            wo."field_address" AS "address",
            wo."dispatcher_id" AS "dispatcher_id",
            wo."tractor_driver_id" AS "tractor_driver_id",
            wo."total_gps-service-acres" AS "gps_acres", 
            "emp".first_name AS "dispatcher_name",
            "farm".name AS "farm_name",
            "field".name AS "field_name",
			tractor."id" AS "tractor_driver_id",
			tractor."first_name" AS "tractor_driver_name"
                     
            FROM 
            "Farming_Work_Order" wo
            INNER JOIN "Customers" c 
            ON wo."customer_id" = c."id" 
                
            INNER JOIN "Employees" emp
            ON "emp".id = wo.dispatcher_id 
                                     
            INNER JOIN "Customer_Farm" farm
            ON "farm".id = wo.farm_id 
                    
            INNER JOIN "Customer_Field" field
            ON "field".id = wo.field_id

            INNER JOIN "Employees" tractor
            ON "tractor".id = wo.tractor_driver_id AND tractor."role" = 'Tractor Driver'
						
            Where wo.work_order_is_completed = FALSE AND 
            "work_order_status" = 'sent' AND

                    ${whereClause}
                    ORDER BY 
                            c."customer_name" ASC;
          `;


            count_query = `
            SELECT 
            COUNT(wo."id")   
   
            FROM 
            "Farming_Work_Order" wo
            INNER JOIN "Customers" c 
            ON wo."customer_id" = c."id" 
                
            INNER JOIN "Employees" emp
            ON "emp".id = wo.dispatcher_id 
                                     
            INNER JOIN "Customer_Farm" farm
            ON "farm".id = wo.farm_id 
                    
            INNER JOIN "Customer_Field" field
            ON "field".id = wo.field_id

            INNER JOIN "Employees" tractor
            ON "tractor".id = wo.tractor_driver_id AND tractor."role" = 'Tractor Driver'
						
            Where wo.work_order_is_completed = FALSE AND 
            "work_order_status" = 'sent' AND
                    ${whereClause};`;
        }

        //////////////////////////////////////////////////////
        // If we make a call from Farming Close Out Work Order
        if (searchClause === 'close_out_work_order') {
            queryGetCustomers = `
            SELECT 
            *
                  FROM 
             "Farming_Work_Order"
     
             Where is_active = true
             AND tractor_driver_id='${employeeId}' And work_order_close_out=false;
          `;

            count_query = `
      SELECT 
              COUNT(id)   
              FROM 
             "Farming_Work_Order"
     
             Where is_active = true
             AND tractor_driver_id='${employeeId}' And work_order_close_out=false;
                   `;
        }

        let query = `${queryGetCustomers} ${count_query}`;

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
