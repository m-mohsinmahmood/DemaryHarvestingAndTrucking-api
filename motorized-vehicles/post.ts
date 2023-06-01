import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { Motorized } from "./model";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { BlobServiceClient } from "@azure/storage-blob";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  //#region Variables
  const db1 = new Client(config);
  let result;
  let motorized_id;
  let image_file: any[] = [];
  const multiPartConfig = {
    limits: { fields: 1, files:3},
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig );



  let motorized: Motorized = JSON.parse(fields[0].value);
  //#endregion
  try {
    // const motorized: Motorized = req.body;
    motorized.pictures = null;


    let query = `
      INSERT INTO 
                  "Motorized_Vehicles" 
                  (
                    "type", 
                    "company_id", 
                    "truck_id",
                    "company_name",      
                    "color", 
                    "year", 
                    "make", 
                    "model", 
                    "title", 
                    "odometer_reading_start",
                    "odometer_reading_end",
                    "license", 
                    "registration", 
                    "insurance_status", 
                    "liability", 
                    "collision", 
                    "comprehensive", 
                    "purchase_price", 
                    "date_of_purchase", 
                    "sales_price", 
                    "date_of_sales", 
                    "estimated_market_value", 
                    "source_of_market_value", 
                    "date_of_market_value",  
                    "vin_number",
                    "name",
                    "license_plate",
                    "pictures",
                    "status"
                  )
                  
      VALUES      (
                  '${motorized.type}', 
                  '${motorized.company_id}', 
                  '${motorized.truck_id}', 
                  '${motorized.company_name}', 
                  '${motorized.color}', 
                  '${motorized.year}', 
                  '${motorized.make}', 
                  '${motorized.model}', 
                  '${motorized.title}', 
                  '${motorized.odometer_reading_start}', 
                  '${motorized.odometer_reading_end}', 
                  '${motorized.license}',
                  '${motorized.registration}',
                  '${motorized.insurance_status}',
                  '${motorized.liability}',
                  '${motorized.collision}',
                  '${motorized.comprehensive}',
                  '${motorized.purchase_price}',
                  '${motorized.date_of_purchase}',
                  '${motorized.sales_price}',
                  '${motorized.date_of_sales}',
                  '${motorized.estimated_market_value}',
                  '${motorized.source_of_market_value}',
                  '${motorized.date_of_market_value}',
                  '${motorized.vin_number}',
                  '${motorized.name}',
                  '${motorized.license_plate}',
                  '${motorized.pictures}',
                  '${motorized.status}'
                  )
                  RETURNING id as motorized_id
    `;

    db.connect();
    result = await db.query(query);
    db.end();
  } catch (error) {
    db.end();
    context.res = {
      status: 400,
      body: {
        message: error.message,
      },
    };
    context.done();
    return;
  }



 //#region Upload Motorized picture
 try {
  motorized_id = result.rows[0].motorized_id;
  const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/equipments?sp=rawl&st=2022-12-30T12:40:43Z&se=2024-12-31T20:40:43Z&spr=https&sv=2021-06-08&sr=c&sig=u7IhnylAaCRbMvPLQrIhBjr%2BW69kC7%2Bz%2FIiER0Y6KJ4%3D");
  const container = blob.getContainerClient("equipments");

  for (let i = 0; i < files.length; i++) {
    image_file[i] = "image" + motorized_id + "-" + i;
    const blockBlob = container.getBlockBlobClient(image_file[i]);
    const uploadFileResp = await blockBlob.uploadData(files[i].bufferFile, {
      blobHTTPHeaders: { blobContentType: files[i].mimeType },
    });
  }
}
catch (error) {
  context.res = {
    status: 400,
    body: {
      message: error,
    },
  };
  context.done();
  return;
}
//#endregion



  //#region link settlement

    let urlString;

    if(files.length == 1){
      urlString = "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[0] ;
    }
  
  
    if(files.length == 2){
      urlString = "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[0] + "," + "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[1];
    }
  
    if(files.length == 3){
      urlString = "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[0] + "," + "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[1] + "," + "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[2];
    } 
  //#endregion


  //#region Update Motorized
  try {
    let update_query = `
      UPDATE "Motorized_Vehicles"
      SET 
      "pictures" = '${urlString}'
      WHERE 
      "id" = '${motorized_id}';`
    db1.connect();
    await db1.query(update_query);
    db1.end();
  } catch (error) {
    db1.end();
    context.res = {
      status: 400,
      body: {
        message: error,
      },
    };
    context.done();
    return;
  }
  //#endregion



    context.res = {
      status: 200,
      body: {
        message: "Motorized Vehicle has been created successfully",
      },
    };

    context.done();
    return;
 
}

export default httpTrigger;
