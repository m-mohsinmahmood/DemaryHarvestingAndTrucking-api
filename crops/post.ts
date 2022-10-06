import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { crop } from "./model";
import { cropValidator } from "./validator";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {    
    //#region Validation
    const crop: crop = req.body;
    const validation = cropValidator(crop);
    let error = [];
    let errorMessage = ``;
    validation.details.forEach((err) => {
      error.push(err.message);
    });
    errorMessage = error.join(", ");
    if (error.length > 0) throw { message: errorMessage };
    //#endregion
    //#region Query Execution
    let query = `
        INSERT INTO "Crops" ("name", "variety", "bushel_weight")
        VALUES ('${crop.name}', '${crop.variety}', '${crop.bushel_weight}');
    `;

    db.connect();
    await db.query(query);
    db.end();
    //#endregion
    //#region Success Response
    context.res = {
      status: 200,
      body: {
        message: "Crop has been created successfully",
      },
    };
    context.done();
    return;
    //#endregion
  } catch (error) {
    //#region Error Response
    context.res = {
      status: 500,
      body: {
        message: error.message,
      },
    };
    return;
    //#endregion
  }
};

export default httpTrigger;
