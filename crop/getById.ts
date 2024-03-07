import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {

    const crop_id: string = req.query.id;

    let crop_info_query = `
        SELECT 
              "id",
              "name",
              "variety",
              "bushel_weight",
              "year" 
        FROM 
            "Crops"
        WHERE 
            "id" = '${crop_id}';
        `;

    db.connect();

    let result = await db.query(crop_info_query);
    let resp;
    if(result.rows.length > 0)
      resp = result.rows[0];
    else 
      resp = {
        message: "No crops exists with this id."
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
