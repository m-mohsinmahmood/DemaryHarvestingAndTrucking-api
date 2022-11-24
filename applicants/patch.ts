import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
import { applicant } from "./model";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const applicant: applicant = req.body;
    let update_attributes = _.omit(applicant, ["id"]); 
    let set_statement: string = "SET ";

    Object.keys(update_attributes).forEach((attribute, index) => {
        if(index < Object.keys(update_attributes).length - 1)
            set_statement = ` ${set_statement} "${attribute}" = '${applicant[attribute]}',` ;
        else 
            set_statement = ` ${set_statement} "${attribute}" = '${applicant[attribute]}'` ;
    });

    let query = `
        UPDATE 
                "Applicants"
        ${set_statement}
        WHERE 
                "id" = '${applicant.id}';`

    db.connect();
    let result = await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Applicant has been updated successfully.",
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
