import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { harvestingInvoice } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    console.log("Customer Harvesting Invoice");

    try {
        // First, required data will be fetched from tables            
        const order: harvestingInvoice = req.body;

        let premiumRate = ``;

        if (order.serviceType === 'Combine Hauling') {
            premiumRate = `select premium_rate from "Combining_Rates" cr
                           INNER JOIN "Crops" crops on cr.crop_id = crops."id" 
                           where crops."name" = '${order.crop}' AND cr.customer_id = '${order.customerId}';`
        } else {
            premiumRate = `select premium_rate from "Hauling_Rates" 
                           where  rate_type='${order.rateType}' AND customer_id = '${order.customerId}';`
        }

        console.log(premiumRate);

        db.connect();

        let result = await db.query(premiumRate);

        let resp = {
            rate: result.rows
        };

        console.log("resp:", resp.rate[0]);
        premiumRate = resp.rate[0].premium_rate;

        let quantityType;

        if (parseInt(premiumRate) > 0) {
            quantityType = 'acres';
        } else quantityType = 'bushels';

        let fetchQuantity = `select bushel_weight from "Crops" where name='${order.crop} ';`

        let resultQuantity = await db.query(fetchQuantity);

        let respQuantity = {
            quantity: resultQuantity.rows
        };

        console.log("resp quantity:", respQuantity.quantity);
        let quantity = respQuantity.quantity;

        // Now data will be posted in designated table
        let query = `
            INSERT INTO 
                        "Harvesting_Invoice" 
                        ("customer_id", 
                        "service_type", 
                        "farm_id",
                        "crop", 
                        "quantity_type",
                        "quantity",
                        "rate" 
                      )

            VALUES      ('${order.customerId}', 
                        '${order.serviceType}', 
                        '${order.farmId}', 
                        '${order.crop}', 
                        '${quantityType}',
                        '${quantity}', 
                        '${premiumRate}' 
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
