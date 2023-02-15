import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { trainee, trainer,preTripCheck,engineCompartment,basicSkills,roadSkills } from "./model";
import { BlobServiceClient } from '@azure/storage-blob';
import parseMultipartFormData from "@anzp/azure-function-multipart";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  let query: string = '';
  let result;
  let record_id;
  let image_1 = '';
  let image_2 = '';
  let image_3 = '';
  const multiPartConfig = {
    limits: { fields: 1, files: 3 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  let trainer: any = (JSON.parse(fields[0].value));

  try {
    const trainee: trainee = req.body;
    // const trainer: trainer = req.body;
    const preTripCheck: preTripCheck = req.body;
    const basicSkills: basicSkills = req.body;
    const roadSkills: roadSkills = req.body;
    const entity = req.query.entity;



    console.log('REQ:',req.body)
    console.log('Entity:',entity)

if(entity === 'trainee'){
  query = `
   INSERT INTO 
               "Trainee" 
               (
               "trainee_id", 
               "trainer_id",
               "city",
               "state",
               "training_type",
               "topic",
               "detail",
               "user_type"
               )
               
   VALUES      (
               '${trainee.trainee_id}', 
               '${trainee.trainer_id}',
               '${trainee.state}',
               '${trainee.city}',
               '${trainee.training_type}',
               '${trainee.topic}',
               '${trainee.detail}',
               'trainee'
 );`;
}else if (entity === 'trainer'){
  // for trainer
  query = `
  INSERT INTO 
              "Trainer_Training_Tasks" 
              (
              "trainer_id", 
              "supervisor_id",
              "city",
              "state",
              "training_type",
              "topic",
              "notes",
              "user_type"
              )
              
  VALUES      (
              '${trainer.trainer_id}',
              '${trainer.supervisor_id}',
              '${trainer.city}',
              '${trainer.state}',
              '${trainer.training_type}',
              '${trainer.topic}',
              $$${trainer.notes}$$,
              'trainer'
)
 RETURNING id as record_id
;`;
} else if(entity === 'pre-trip' && preTripCheck.evaluation_form === 'paper-form'){
  // for pre-trip check form having 'Paper Form'
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

}else if(entity === 'pre-trip' && preTripCheck.evaluation_form === 'digital-form'){
  // for pre-trip check form having 'Digital Form'
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
              "evaluation_type",
              "is_digital_form_started"
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
              'pre-trip',
              'TRUE'
)
 RETURNING id as training_record_id
;`;

}else if(entity === 'basic-skills' && basicSkills.evaluation_form === 'paper-form'){
  // for basic skills form having 'Paper Form'
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
              "clp",
              "truckId",
              "odometerEndingMiles",
              "odometerStartingMiles",
              "evaluation_type"
              )
              
  VALUES      (
              '${basicSkills.trainer_id}',
              '${basicSkills.trainee_id}',
              '${basicSkills.supervisor_id}',
              '${basicSkills.city}',
              '${basicSkills.state}',
              '${basicSkills.evaluation_form}',
              '${basicSkills.is_completed_cdl_classroom}',
              '${basicSkills.is_completed_group_practical}',
              '${basicSkills.clp}',
              '${basicSkills.truckId}',
              '${basicSkills.odometerEndingMiles}',
              '${basicSkills.odometerStartingMiles}',
              'basic-skills'
);`;

}else if(entity === 'basic-skills' && basicSkills.evaluation_form === 'digital-form'){
  // for pre-trip check form having 'Digital Form'
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
              "clp",
              "odometerEndingMiles",
              "odometerStartingMiles",
              "truckId",
              "evaluation_type",
              "is_digital_form_started"
              )
              
  VALUES      (
              '${basicSkills.trainer_id}',
              '${basicSkills.trainee_id}',
              '${basicSkills.supervisor_id}',
              '${basicSkills.city}',
              '${basicSkills.state}',
              '${basicSkills.evaluation_form}',
              '${basicSkills.is_completed_cdl_classroom}',
              '${basicSkills.is_completed_group_practical}',
              '${basicSkills.clp}',
              '${basicSkills.odometerEndingMiles}',
              '${basicSkills.odometerStartingMiles}',
              '${basicSkills.truckId}',
              'basic-skills',
              'TRUE'
);`;

}else if(entity === 'road-skills' && roadSkills.evaluation_form === 'paper-form'){
  // for basic skills form having 'Paper Form'
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
              "clp",
              "truckId",
              "odometerEndingMiles",
              "odometerStartingMiles",
              "evaluation_type"
              )
              
  VALUES      (
              '${roadSkills.trainer_id}',
              '${roadSkills.trainee_id}',
              '${roadSkills.supervisor_id}',
              '${roadSkills.city}',
              '${roadSkills.state}',
              '${roadSkills.evaluation_form}',
              '${roadSkills.is_completed_cdl_classroom}',
              '${roadSkills.is_completed_group_practical}',
              '${roadSkills.clp}',
              '${basicSkills.truckId}',
            '${roadSkills.odometerEndingMiles}',
              '${roadSkills.odometerStartingMiles}',
              'road-skills'
);`;

}else if(entity === 'road-skills' && roadSkills.evaluation_form === 'digital-form'){
  // for pre-trip check form having 'Digital Form'
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
              "clp",
              "odometerEndingMiles",
              "odometerStartingMiles",
              "truckId",
              "evaluation_type",
              "is_digital_form_started"
              )
              
  VALUES      (
              '${roadSkills.trainer_id}',
              '${roadSkills.trainee_id}',
              '${roadSkills.supervisor_id}',
              '${roadSkills.city}',
              '${roadSkills.state}',
              '${roadSkills.evaluation_form}',
              '${roadSkills.is_completed_cdl_classroom}',
              '${roadSkills.is_completed_group_practical}',
              '${roadSkills.clp}',
              '${roadSkills.odometerEndingMiles}',
              '${roadSkills.odometerStartingMiles}',
              '${roadSkills.truckId}',
              'road-skills',
              'TRUE'
);`;

}

    db.connect();
    console.log(query)
   result =  await db.query(query);
    db.end();
   
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
    //#region Upload
    try {
      record_id = result.rows[0].record_id;
      const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/training?sp=rwdl&st=2023-02-01T11:36:10Z&se=2024-12-31T19:36:10Z&spr=https&sv=2021-06-08&sr=c&sig=We3CxYtlHMyvsDa0tVag%2Fc0i%2BKniBfMoEXNRLq0qhBU%3D");
      const container = blob.getContainerClient("training");
     
      if (files[0]){
        image_1 = "image_1" + record_id;
        const imageBlockBlob = container.getBlockBlobClient(image_1);
        const res = await imageBlockBlob.uploadData(files[0].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[0].mimeType },
        });
      }
      
      if (files[1]){
        image_2 = "image_2" + record_id;
        const imageBlockBlob = container.getBlockBlobClient(image_2);
        const res = await imageBlockBlob.uploadData(files[1].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[1].mimeType },
        });
      }
      if (files[2]){
        image_3 = "image_3" + record_id;
        const imageBlockBlob = container.getBlockBlobClient(image_3);
        const res = await imageBlockBlob.uploadData(files[2].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[2].mimeType },
        });
      }
    }
    catch (error) {
      context.res = {
        status: 400,
        body: {
          message: "An error occured while creating the Trainer",
        },
      };
      context.done();
      return;
    }
    //#endregion
    //#region Update Trainer_Training_Tasks
  try {
    let update_query = `
    UPDATE "Trainer_Training_Tasks"
    SET `;

    if (files[0]) update_query = update_query + `"image_1" = '${'https://dhtstorageaccountdev.blob.core.windows.net/training/training/' + image_1}'` 
    if (files[1]) update_query = update_query + `,"image_2" = '${'https://dhtstorageaccountdev.blob.core.windows.net/training/training/' + image_2}'` 
    if (files[2]) update_query = update_query + `,"image_3" = '${'https://dhtstorageaccountdev.blob.core.windows.net/training/training/' + image_3}'` 

    update_query = update_query + `WHERE "id" = '${record_id}';`
    db1.connect();
    await db1.query(update_query);
    db1.end();
  } catch (error) {
    db1.end();
    context.res = {
      status: 400,
      body: {
        message: "An error occured while creating the trainer",
      },
    };
    context.done();
    return;
  }
  //#endregion

   context.res = {
      status: 200,
      body: {
       id:  result.rows[0],
        message: "Your details have been submitted",
        status: 200,
      },
    };

    context.done();
    return;
};

export default httpTrigger;
