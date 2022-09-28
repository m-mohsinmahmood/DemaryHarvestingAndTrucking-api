import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { crop } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const crop: crop = req.body;

    let query = `
        INSERT INTO "Crops" ("name", "category", "bushel_weight")
        VALUES ('${crop.name}', '${crop.category}', '${crop.bushel_weight}');
    `;

    db.connect();
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Crop has been created successfully",
      },
    };

    context.done();
    return;
  } catch (error) {
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
