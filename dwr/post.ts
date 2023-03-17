import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { beginningOfDay } from "./model";
import { createDWR } from "../utilities/dwr_functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const order: beginningOfDay = req.body;

    let query = createDWR(order);
    db.connect();
    await db.query(query);

    if (order.module === "training" || order.module === "main-repair") {
      let taskId = await db.query(query);
      let bridgeDailyTasksDwr = ``;
      taskId = taskId.rows[0].id;
      console.log("task Id: ", taskId);
      let ticket = ``;

      if (order.module === "training") {
        ticket = `"training_record_id" = '${ticket}'`;
      } else if (order.module === "main-repair")
        ticket = `"main_repair_ticket_id" = '${ticket}'`;

      bridgeDailyTasksDwr = ` 
        INSERT INTO 
        "Bridge_DailyTasks_DWR" 
        (
          "dwr_id",
          "task_id"
        )

         VALUES      
            
        ('${order.dwrId}',
         '${taskId}'
        );

        
          UPDATE 
            "DWR"
          SET 
          "is_day_closed" = 'true',
          "modified_at"   = 'now()'
          WHERE 
        
          ${ticket} AND is_day_closed = 'false' 
          returning id;
            
            `;

      let result = await db.query(bridgeDailyTasksDwr);
    }

    db.end();

    context.res = {
      status: 200,
      body: {
        message: "DWR has been created successfully",
        status: 200,
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
