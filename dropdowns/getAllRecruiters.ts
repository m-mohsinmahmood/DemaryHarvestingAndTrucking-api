import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const search: string = req.query.search;
    // let whereClause: string = `WHERE "is_deleted" = false`;

    // if (search) whereClause = whereClause + ` AND LOWER(name) LIKE LOWER('%${search}%')`;

    // let crops_dropdown_query = `
    //     SELECT 
    //           "id", 
    //           CONCAT ("name", ' (', "variety", ')') AS "name"
    //     FROM 
    //           "Crops" 
    //     ${whereClause}
    //     ORDER BY 
    //           "name" ASC
    //   `;

    // let query = `${crops_dropdown_query}`;

    // db.connect();

    // let result = await db.query(query);

    let recruiters = [
        {
            id: "84df662a-8687-47ff-8f6f-1a2b27f9a95d",
            name: "Matt Demaray",
            calendly: [
              "Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/matt_dht-usa/interview-teams",
              "</br>Click here to schedule an interview using Zoom:  https://calendly.com/matt_dht-usa/interview-zoom",
              "</br>Click here to schedule an interview using Phone:  https://calendly.com/matt_dht-usa/interview-phone-1"
            ]
            
        },
        {
            id: "8d0414fa-fbe6-417c-b7d5-3ab1bf1aaffd",
            name: "Bill Demaray",
            calendly: [
              "Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/bill_dht-usa/interview-teams",
              "</br>Click here to schedule an interview using Zoom:  https://calendly.com/bill_dht-usa/interview-zoom",
              "</br>Click here to schedule an interview using Phone:  https://calendly.com/bill_dht-usa/interview-phone-1"
            ]
        },
        {
            id: "524c9a3c-af1c-4159-95fd-ddf72eab357f",
            name: "Craig Reinhart",
            calendly: [
              "Click here to schedule an interview using Microsoft TEAMS:  https://calendly.com/craig_dht-usa/interview-teams",
              "</br>Click here to schedule an interview using Zoom:  https://calendly.com/craig_dht-usa/interview-zoom",
              "</br>Click here to schedule an interview using Phone:  https://calendly.com/craig_dht-usa/interview-phone-1"
            ]
        }
    ];

    if (search) {
        recruiters = recruiters.filter(recruiter => recruiter.name.toLowerCase().includes(search.toLowerCase()));
    }

    let resp = {
      recruiters: recruiters
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
