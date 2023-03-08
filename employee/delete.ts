import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
const admin = require('firebase-admin');
import { initializeFirebase } from "../utilities/initialize-firebase";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee_id: string = req.query.id;
    const firebase_id: string = req.query.fb_id;
    if (!admin.apps.length) {
      initializeFirebase();
    }
    try {
      await admin.auth().deleteUser(firebase_id);
      let query = `
          UPDATE "Employees" 
          SET "is_deleted"  = TRUE, 
              "modified_at" = 'now()'
          WHERE 
              "id" = '${employee_id}';`;
      db.connect();
      let result = await db.query(query);
      db.end();

      context.res = {
        status: 200,
        body: {
          message: "Employee has been deleted successfully.",
        },
      };
      context.done();
      return;
    }
    catch (error) {
      context.res = {
        status: 500,
        body: {
          message: error.message,
        },
      };
      return;
    }
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
