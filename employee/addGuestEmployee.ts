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
            INSERT INTO 
            "Employees" 
            (
            "first_name",
            "last_name",
            "email",
            "role",
            "company"
            )

            VALUES      
            (
            '${emp.first_name}',
            '${emp.last_name}',
            '${emp.email}',
            '${emp.role}',
            '${emp.employee_company}'
            );
            
            
            INSERT INTO 
            "Motorized_Vehicles" 
            (
            "name",
            "type"
            )

            VALUES      
            (
            '${emp.machinery}',
            'Truck IFTA'
            )
            RETURNING id as truck_id;
            `;

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



