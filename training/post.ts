import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { trainee, trainer,preTripCheck } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  let query: string = '';
  try {
    const trainee: trainee = req.body;
    const trainer: trainer = req.body;
    const preTripCheck: preTripCheck = req.body;
    const entity = req.query.entity;
    console.log('REQ:',req.body)
    console.log('Entity:',entity)
if(entity === 'trainee'){
  query = `
   INSERT INTO 
               "Training" 
               (
               "trainee_id", 
               "trainer_id",
               "city",
               "state",
               "training_type",
               "topic",
               "detail"
               )
               
   VALUES      (
               '${trainee.trainee_id}', 
               '${trainee.trainer_id}',
               '${trainee.state}',
               '${trainee.city}',
               '${trainee.training_type}',
               '${trainee.topic}',
               '${trainee.detail}'
 );`;
}else if (entity === 'trainer'){
  // for trainer
  query = `
  INSERT INTO 
              "Training" 
              (
              "trainer_id", 
              "supervisor_id",
              "city",
              "state",
              "training_type",
              "topic",
              "notes"
              )
              
  VALUES      (
              '${trainer.trainer_id}',
              '${trainer.supervisor_id}',
              '${trainer.city}',
              '${trainer.state}',
              '${trainer.training_type}',
              '${trainer.topic}',
              '${trainer.notes}'
);`;
} else if(entity === 'pre-trip'){
  // for pre-trip check form
  query = `
  INSERT INTO 
              "Training" 
              (
              "trainer_id", 
              "trainee_id",
              "supervisor_id",
              "city",
              "state",
              "evaluation_form",
              "is_completed_cdl_classroom",
              "is_completed_group_practical",
              "evaluation_type"
              )
              
  VALUES      (
              '${preTripCheck.trainer_id}',
              '${preTripCheck.trainee_id}',
              '${preTripCheck.supervisor_id}',
              '${preTripCheck.city}',
              '${preTripCheck.state}',
              '${preTripCheck.evaluation_form}',
              '${preTripCheck.is_completed_cdl_classroom}',
              '${preTripCheck.is_completed_group_practical}',
              'pre-trip'
);`;

}

    db.connect();
    console.log(query)
    await db.query(query);
    db.end();

    context.res = {
      status: 200,
      body: {
        message: "Your details have been submitted",
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
