import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { truckingInvoice } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    console.log("Customer Trucking Invoice");

    try {
        // First, required data will be fetched from tables            
        const order: truckingInvoice = req.body;

        let rate = `select rate, rate_type from "Trucking_Rates" where customer_id = '${order.customerId}' 
                    AND id='${order.rateType}' ; `;

        let quantity = order.weightLoad;


        let fetchData = `${rate}`;

        console.log(fetchData);

        db.connect();

        let result = await db.query(fetchData);

        let resp = {
            rate: result.rows
        };

        console.log("Rate:", resp.rate[0].rate);

        rate = resp.rate[0].rate;
        let amount = parseInt(quantity) * parseFloat(rate);
        console.log("amount:", amount);

        // Now data will be posted in designated table            
        let query = `
            INSERT INTO 
                        "Trucking_Invoice" 
                        ("customer_id", 
                        "billing_id", 
                        "cargo", 
                        "city",
                        "state", 
                        "rate_type",
                        "rate",
                        "amount" 
                      )

            VALUES      ('${order.customerId}', 
                        '', 
                        '${order.cargo}', 
                        '${order.destinationCity}',
                        '${order.destinationState}', 
                        '${resp.rate[0].rate_type}',
                        '${rate}', 
                        '${amount}' 
                       );
          `;

        console.log(query);
        await db.query(query);

        db.end();

        context.res = {
            status: 200,
            body: {
                status: 200,
                message: "Invoice has been created successfully",
            },
        };

        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                status: 500,
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
