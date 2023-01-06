import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { machinery } from "./model";
import { BlobServiceClient } from '@azure/storage-blob';
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { json } from "stream/consumers";
import { stringify } from "querystring";



const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  //#region Variables
  const db1 = new Client(config);
  let result;
  let machinery_id;
  let image_file: any[] = [];
  const multiPartConfig = {
    limits: { fields: 1, files: 3 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);



  let machinery: machinery = JSON.parse(fields[0].value);
  //#endregion

  try {
    // const machinery: machinery = req.body;
    machinery.pictures = null;


    let query = `
      INSERT INTO 
                  "Machinery" 
                  (
                    "type", 
                    "company_id", 
                    "color", 
                    "year", 
                    "make", 
                    "model", 
                    "serial_number", 
                    "engine_hours", 
                    "eh_reading",
                    "sh_reading",
                    "separator_hours", 
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
                    "name",
                    "pictures",
                    "status"
                  )
                  
      VALUES      (
                  '${machinery.type}', 
                  '${machinery.company_id}', 
                  '${machinery.color}', 
                  '${machinery.year}', 
                  '${machinery.make}', 
                  '${machinery.model}', 
                  '${machinery.serial_number}', 
                  '${machinery.engine_hours}',
                  '${machinery.eh_reading}',
                  '${machinery.sh_reading}',
                  '${machinery.separator_hours}',
                  '${machinery.insurance_status}',
                  '${machinery.liability}',
                  '${machinery.collision}',
                  '${machinery.comprehensive}',
                  '${machinery.purchase_price}',
                  '${machinery.date_of_purchase}',
                  '${machinery.sales_price}',
                  '${machinery.date_of_sales}',
                  '${machinery.estimated_market_value}',
                  '${machinery.source_of_market_value}',
                  '${machinery.date_of_market_value}',
                  '${machinery.name}',
                  '${machinery.pictures}',
                  '${machinery.status}'
                  )
                  RETURNING id as machinery_id

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
    machinery_id = result.rows[0].machinery_id;
    const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/equipments?sp=rawl&st=2022-12-30T12:40:43Z&se=2024-12-31T20:40:43Z&spr=https&sv=2021-06-08&sr=c&sig=u7IhnylAaCRbMvPLQrIhBjr%2BW69kC7%2Bz%2FIiER0Y6KJ4%3D");
    const container = blob.getContainerClient("equipments");

    for (let i = 0; i < files.length; i++) {
      image_file[i] = "image" + machinery_id + "-" + i;
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
      UPDATE "Machinery"
      SET 
      "pictures" = '${urlString}'
      WHERE 
      "id" = '${machinery_id}';`
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
      message: "Machinery has been created successfully",
    },
  };

  context.done();
  return;
}

export default httpTrigger;

