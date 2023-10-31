import { guestEmployee } from './model';
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import * as _ from "lodash";
import { config } from "../services/database/database.config";
const admin = require('firebase-admin');
import { initializeFirebase } from "../utilities/initialize-firebase";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    let make_employee_query;
    let result;
    let firebase_id;

    try {
        const emp: guestEmployee = req.body;

        if (emp.email != null && emp.email != '') {
            // Create employee if applicant accepts offer
            if (!admin.apps.length) {
                initializeFirebase();
            }
            // Define the custom claims object
            try {
                // Create a new user
                const userRecord = await admin.auth().createUser({
                    email: emp.email,
                    password: 'dht@123',
                });
                firebase_id = userRecord.uid;
                const customClaims = {
                    fb_id: userRecord.uid,
                };

                make_employee_query = `
           
	WITH inserted_employee AS (
        INSERT INTO "Employees" ("first_name", "last_name", "email", "role", "guest_user_type", "fb_id" ,"is_guest_user", "trucking_company", "created_at")
        VALUES ('${emp.first_name}', '${emp.last_name}', '${emp.email}', '${emp.employee_role}', '${emp.user_type}' , '${firebase_id}' ,TRUE, '${emp.trucking_company}' ,'now()')
        RETURNING ID
      ),
    inserted_truck AS (
        INSERT INTO "Motorized_Vehicles" ("name", "type", "status" ,"guest_vehicle")
        VALUES ('${emp.machinery}', 'Truck IFTA', TRUE ,TRUE)
        RETURNING ID
      )
            `;

                if (emp.employee_role == 'Truck Driver') {
                    make_employee_query = `
                ${make_employee_query}
                INSERT INTO "User_Profile" (employee_id, truck_id)
                VALUES ((SELECT ID FROM inserted_employee), (SELECT ID FROM inserted_truck))
                ON CONFLICT (employee_id) DO UPDATE
                SET truck_id = EXCLUDED.truck_id;
                `
                }

                admin.auth().setCustomUserClaims(userRecord.uid, customClaims);
            } catch (error) {
                context.res = {
                    status: 500,
                    body: {
                        message: error.message,
                    },
                };
                return;
            }
        }
        else {
            try {
                make_employee_query = `
           
                WITH inserted_employee AS (
                    INSERT INTO "Employees" ("first_name", "last_name", "role", "guest_user_type","is_guest_user", "is_email_provided", "trucking_company" ,"created_at")
                    VALUES ('${emp.first_name}', '${emp.last_name}', '${emp.employee_role}', '${emp.user_type}' ,TRUE, FALSE, '${emp.trucking_company}' ,'now()')
                    RETURNING ID
                  ),
                inserted_truck AS (
                    INSERT INTO "Motorized_Vehicles" ("name", "type", "status" ,"guest_vehicle")
                    VALUES ('${emp.machinery}', 'Truck IFTA', TRUE ,TRUE)
                    RETURNING ID
                  )
                    `;

                if (emp.employee_role == 'Truck Driver') {
                    make_employee_query = `
                            ${make_employee_query}
                    INSERT INTO "User_Profile" (employee_id, truck_id)
                    VALUES ((SELECT ID FROM inserted_employee), (SELECT ID FROM inserted_truck))
                    ON CONFLICT (employee_id) DO UPDATE
                    SET truck_id = EXCLUDED.truck_id;
                    `;
                }

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
        }

        let query = `${make_employee_query}`;
        db.connect();
        result = await db.query(query);
        db.end();

        context.res = {
            status: 200,
            body: {
                message: "Employee has been created successfully.",
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



