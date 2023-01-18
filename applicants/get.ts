import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import * as moment from 'moment';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const search: string = req.query.search;
    const state: string = req.query.state;
    const status: string = req.query.status;
    const date: string = req.query.date;
    const ranking: string = req.query.ranking;
    const created_at: string = req.query.created_at;
    const page: number = +req.query.page ? +req.query.page : 1;
    const limit: number = +req.query.limit ? +req.query.limit : 10;
    const sort: string = req.query.sort ? req.query.sort : `created_at` ;
    const order: string = req.query.order ? req.query.order : `asc`;
    let whereClause: string = ` WHERE "is_deleted" = FALSE`;

    if (search) whereClause = ` ${whereClause} AND LOWER("last_name") LIKE LOWER('%${search}%')`;
    if (state) whereClause = ` ${whereClause} AND "state" = '${state}'`;
    if (created_at) whereClause = ` ${whereClause} AND  extract(year from "created_at") = '${created_at}'`;
    if (status) whereClause = ` ${whereClause} AND status_message = '${status}'`; 
    if (ranking) {
      if (ranking == "first_ranking") whereClause = ` ${whereClause} AND ranking  < 30 `;
      else if (ranking == "second_ranking") whereClause = ` ${whereClause} AND ranking > 30 AND ranking < 70`; 
      else if (ranking == "third_ranking") whereClause = ` ${whereClause} AND ranking  > 70`;
    }
    if (date){
      let moment_date = moment(date).format('DD-MM-YYYY'); 
      whereClause = ` ${whereClause} AND to_char(created_at,'DD-MM-YYYY') = '${moment_date}' `;
    }
    
    let applicant_query = `
        SELECT 
                "id",
                "first_name",
                "last_name",
                "email",
                "country",
                "cell_phone_number",
                "cell_phone_country_code",
                "ranking",
                "created_at",
                "status_step",
                "status_message"
        FROM 
                "Applicants"
        ${whereClause}
        ORDER BY 
              ${sort} ${order}
        OFFSET 
              ${((page - 1) * limit)}
        LIMIT 
              ${limit};
      `;

    let applicant_count_query = `
        SELECT 
              COUNT("id")
        FROM 
              "Applicants"
        ${whereClause};
      `;

    let query = `${applicant_query} ${applicant_count_query}`;

    db.connect();

    let result = await db.query(query);

    let resp = {
      applicants: result[0].rows,
      count: +result[1].rows[0].count,
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
