import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const customer_id: string = req.query.customer_id;
    const sort: string = req.query.sort ? req.query.sort : `fi."created_at"`;
    const order: string = req.query.order ? req.query.order : `desc`;



    let farming_list_query = `
    SELECT 
  fi."id",
	fi.date,
	fi.equipment_type,
	fi.quantity_type,
	fi.quantity,
	fi.rate,
	fi.amount,
	fi.customer_id
	
	from "Farming_Invoice" fi
  WHERE fi.customer_id = '${customer_id}'
        ORDER BY 
              ${sort} ${order};

      `;




    let query = `${farming_list_query} `;

    db.connect();

    let result = await db.query(query);

    let resp = {
      farmingInvoicesList: result.rows
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
