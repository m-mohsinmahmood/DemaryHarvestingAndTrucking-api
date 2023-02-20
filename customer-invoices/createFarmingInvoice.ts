import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { farmingInvoice } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    console.log("Customer Invoice");

    try {
        // First, required data will be fetched from tables            
        const order: farmingInvoice = req.body;

        let rate = `select equipment_type, rate from "Farming_Rates" where customer_id = '${order.customerId}' 
                    AND equipment_type='${order.equipmentType}' ;`;

        let quantity = `select acres as quantity from "Customer_Field" where customer_id = '${order.customerId}' 
                        AND id = '${order.fieldId}' ;`;


        let fetchData = `${rate} ${quantity}`;

        console.log(fetchData);

        db.connect();

        let result = await db.query(fetchData);

        let resp = {
            rate: result[0].rows,
            quantity: result[1].rows
        };

        console.log("Rate:", resp.rate[0].rate);
        console.log("quantity:", resp.quantity[0].quantity);

        quantity = resp.quantity[0].quantity
        rate = resp.rate[0].rate;
        let amount = parseInt(quantity) * parseFloat(rate);
        // Now data will be posted in designated table            
        let query = `
            INSERT INTO 
                        "Farming_Invoice" 
                        ("customer_id", 
                        "equipment_type", 
                        "quantity_type", 
                        "quantity",
                        "rate", 
                        "amount",
                        "field_id" 
                      )

            VALUES      ('${order.customerId}', 
                        '${order.equipmentType}', 
                        'acres', 
                        '${quantity}', 
                        '${rate}',
                        '${amount}', 
                        '${order.fieldId}' 
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
