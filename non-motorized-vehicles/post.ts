import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { NonMotorized } from "./model";
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
  let non_motorized_id;
  let image_file: any[] = [];
  const multiPartConfig = {
    limits: { fields: 1, files: 3 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);



  let non_motorized: NonMotorized = JSON.parse(fields[0].value);
  //#endregion

  try {
    // const non_motorized: NonMotorized = req.body;
    non_motorized.pictures = null;

    let query = `
      INSERT INTO 
                  "Non_Motorized_Vehicles" 
                  (
                    "type", 
                    "company_id", 
                    "color", 
                    "year", 
                    "make", 
                    "model", 
                    "title", 
                    "odometer",
                    "odometer_reading",
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
                  '${non_motorized.type}', 
                  '${non_motorized.company_id}', 
                  '${non_motorized.color}', 
                  '${non_motorized.year}', 
                  '${non_motorized.make}', 
                  '${non_motorized.model}', 
                  '${non_motorized.title}', 
                  '${non_motorized.odometer}', 
                  '${non_motorized.odometer_reading}', 
                  '${non_motorized.license}',
                  '${non_motorized.registration}',
                  '${non_motorized.insurance_status}',
                  '${non_motorized.liability}',
                  '${non_motorized.collision}',
                  '${non_motorized.comprehensive}',
                  '${non_motorized.purchase_price}',
                  '${non_motorized.date_of_purchase}',
                  '${non_motorized.sales_price}',
                  '${non_motorized.date_of_sales}',
                  '${non_motorized.estimated_market_value}',
                  '${non_motorized.source_of_market_value}',
                  '${non_motorized.date_of_market_value}',
                  '${non_motorized.vin_number}',
                  '${non_motorized.name}',
                  '${non_motorized.license_plate}',
                  '${non_motorized.pictures}',
                  '${non_motorized.status}'
                  )
                  RETURNING id as non_motorized_id
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


  //#region Upload Machinery picture
  try {
    non_motorized_id = result.rows[0].non_motorized_id;
    const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/equipments?sp=rawl&st=2022-12-30T12:40:43Z&se=2024-12-31T20:40:43Z&spr=https&sv=2021-06-08&sr=c&sig=u7IhnylAaCRbMvPLQrIhBjr%2BW69kC7%2Bz%2FIiER0Y6KJ4%3D");
    const container = blob.getContainerClient("equipments");

    for (let i = 0; i < files.length; i++) {
      image_file[i] = "image" + non_motorized_id + "-" + i;
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

  if (files.length == 1) {
    urlString = "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[0];
  }


  if (files.length == 2) {
    urlString = "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[0] + "," + "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[1];
  }

  if (files.length == 3) {
    urlString = "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[0] + "," + "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[1] + "," + "https://dhtstorageaccountdev.blob.core.windows.net/equipments/equipments/" + image_file[2];
  }
  //#endregion


  //#region Update Machinery
  try {
    let update_query = `
      UPDATE "Non_Motorized_Vehicles"
      SET 
      "pictures" = '${urlString}'
      WHERE 
      "id" = '${non_motorized_id}';`
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
      message: "Non Motorized Vehicle has been created successfully",
    },
  };

  context.done();
  return;
}

export default httpTrigger;

