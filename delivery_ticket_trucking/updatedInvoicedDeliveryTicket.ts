import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);

    try {
        const { invoice, total_amount, filters, title } = req.body.invoice;
        const customerid = req.body.customerId;

        let whereClause = ``;
        if (filters.date_period_start) whereClause = ` ${whereClause}  AND '${filters.date_period_start}' <= created_at::"date"`;
        if (filters.date_period_end) whereClause = ` ${whereClause}  AND '${filters.date_period_end}' >= created_at::"date"`;
        if (filters.service_type) whereClause = ` ${whereClause}  AND service = '${filters.service_type}'`;
        if (filters.quantity_type) whereClause = ` ${whereClause}  AND rate_type = '${filters.quantity_type}'`;

        let insertquery = `
            INSERT INTO 
                        "Trucking_Invoice" 
                        ("total_amount", 
                        "invoice_name",
                        "customer_id"
                      )

            VALUES      ('${total_amount}', 
                        '${title.truckingTitle}',
                        '${customerid}'
                       ) returning id;
          `;

        db.connect();
        console.log(insertquery);

        let invoiceId = await db.query(insertquery);
        invoiceId = invoiceId.rows[0].id;
        console.log("Invoice: ", invoiceId);

        let farmingInvoiceRecords = ``;

        invoice.forEach(element => {
            farmingInvoiceRecords =
                farmingInvoiceRecords +

                `INSERT INTO 
                        "Trucking_Invoice_Records" 
                        ("equipment", 
                        "rate", 
                        "quantity", 
                        "amount",
                        "trucking_invoice_id"
                      )

            VALUES      ('${element.description}', 
                        '${element.rate}', 
                        '${element.total_acres == undefined ? '' : element.total_acres}', 
                        '${element.total_amount}',
                        '${invoiceId}'
                       );
          `;
        });

        console.log("Trucking invoice Records: ", farmingInvoiceRecords);

        let resultOfRecords = await db.query(farmingInvoiceRecords);

        // If user make a call from Verify Work Order of Dispatcher
        console.log("Updating Work Order for Invoice");

        let query = `
                UPDATE "Trucking_Delivery_Ticket"

				SET    
                ticket_status = 'invoiced',
                invoice_id = '${invoiceId}',
                modified_at = now()
							 
				WHERE customer_id = '${customerid}'
                ${whereClause}
                AND "ticket_status" = 'verified'
				AND is_deleted = FALSE
                ;`

        console.log(query);

        let result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Delivery Ticket has been updated successfully.",
                status: 200
            },
        };
        context.done();
        return;
    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                message: error.message,
            },
        };
        return;
    }
};

export default httpTrigger;
