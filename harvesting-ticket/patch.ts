import parseMultipartFormData from "@anzp/azure-function-multipart";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { Client } from "pg";
import { config } from "../services/database/database.config";
// import { ticket_update, ticket_update_kart, ticket_reassign } from "./model";
import { UpdateHarvestingTicket } from "./model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);
  const db1 = new Client(config);
  let query = ``;
  let image_1 = '';
  let image_2 = '';
  const multiPartConfig = {
    limits: { fields: 3, files: 2 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  const ticket_update: any = (JSON.parse(fields[0].value));
  const operation: any = fields[1].value;
  const id: any = fields[2]?.value;

  try {

    if (operation === 'verifyTicket') {
      query = `
            UPDATE 
                    "Harvesting_Delivery_Ticket"
            SET 
                    "ticket_status"                     = 'verified',
                    "modified_at" = CURRENT_TIMESTAMP

            WHERE 
                    "id" = '${id}';`

    }

    else if (operation === 'completeTicket') {
      let optionalReq: string = ``;

      if (ticket_update.fieldId != null) {
        optionalReq = `${optionalReq},"field_id" = '${ticket_update.fieldId}'`;
      }

      if (ticket_update.destination != null) {
        optionalReq = `${optionalReq},"destination" = '${ticket_update.destination}'`;
      }

      if (ticket_update.farmId != null) {
        optionalReq = `${optionalReq},"farm_id" = '${ticket_update.farmId}'`;
      }

      if (ticket_update.NetWeight != null) {
        optionalReq = `${optionalReq},"scale_ticket_weight" = '${ticket_update.NetWeight}'`;
      }

      if (ticket_update.testWeight != null) {
        optionalReq = `${optionalReq},"test_weight" = '${ticket_update.testWeight}'`;
      }

      if (ticket_update.proteinContent != null) {
        optionalReq = `${optionalReq},"protein_content" = '${ticket_update.proteinContent}'`;
      }

      if (ticket_update.moistureContent != null) {
        optionalReq = `${optionalReq},"moisture_content" = '${ticket_update.moistureContent}'`;
      }
      if (ticket_update.moistureContent != null) {
        optionalReq = `${optionalReq},"image_1" = '${ticket_update.moistureContent}'`;
      }
      if (ticket_update.moistureContent != null) {
        optionalReq = `${optionalReq},"image_2" = '${ticket_update.moistureContent}'`;
      }
      if (ticket_update.farmers_bin_weight != null) {
        optionalReq = `${optionalReq},"farmers_bin_weight" = '${ticket_update.farmers_bin_weight}'`;
      }
      if (ticket_update.machineryId != null) {
        optionalReq = `${optionalReq},"machinery_id" = '${ticket_update.machineryId}'`;
      } if (ticket_update.scaleTicket != null) {
        optionalReq = `${optionalReq},"scale_ticket_number" = '${ticket_update.scaleTicket}'`;
      }

      query = `
      UPDATE 
          "Harvesting_Delivery_Ticket"
      SET 
          "ticket_status" = 'pending'
           ${optionalReq}
      WHERE 
          "id" = '${ticket_update.ticketId}' ;
          
          
      INSERT INTO "User_Profile" (employee_id, truck_id)
      VALUES ('${ticket_update.truckDriverId}', '${ticket_update.machineryId}')
      ON CONFLICT (employee_id) DO UPDATE SET truck_id = EXCLUDED.truck_id;
          `
    }

    db.connect();
    let result = await db.query(query);
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
  if (files.length !== 0) {
    try {
      // record_id = result.rows[0].record_id;
      const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/harvesting?sp=rwdl&st=2023-02-01T11:34:13Z&se=2024-12-31T19:34:13Z&spr=https&sv=2021-06-08&sr=c&sig=bTmJLiDq8VnYd%2FieX8HO1HlxTH607WcxuRqZe0xZ50c%3D");
      const container = blob.getContainerClient("harvesting");

      if (files[0]) {
        image_1 = "image_1" + ticket_update.ticketId;
        const imageBlockBlob = container.getBlockBlobClient(image_1);
        const res = await imageBlockBlob.uploadData(files[0].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[0].mimeType },
        });
      }

      if (files[1]) {
        image_2 = "image_2" + ticket_update.ticketId;
        const imageBlockBlob = container.getBlockBlobClient(image_2);
        const res = await imageBlockBlob.uploadData(files[1].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[1].mimeType },
        });
      }
    }
    catch (error) {
      context.res = {
        status: 400,
        body: {
          message: "An error occured while creating the Trainerrrr",
        },
      };
      context.done();
      return;
    }

  }
  //#endregion
  //#region Update Harvesting_Delivery_Ticket (Complete Ticket)
  if (operation === 'completeTicket' && files.length !== 0) {
    try {
      let update_query = `
    UPDATE "Harvesting_Delivery_Ticket"
    SET `;

      if (files[0]) update_query = update_query + `"image_1" = '${'https://dhtstorageaccountdev.blob.core.windows.net/harvesting/harvesting/' + image_1}'`
      if (files[1]) update_query = update_query + `,"image_2" = '${'https://dhtstorageaccountdev.blob.core.windows.net/harvesting/harvesting/' + image_2}'`

      update_query = update_query + `WHERE "id" = '${ticket_update.ticketId}';`
      db1.connect();
      await db1.query(update_query);
      db1.end();
    } catch (error) {
      db1.end();
      context.res = {
        status: 400,
        body: {
          message: "An error occured while creating the trainerr",
        },
      };
      context.done();
      return;
    }
  }
  //#endregion

  context.res = {
    status: 200,
    body: {
      message: "Ticket has been updated successfully.",
      status: 200,
    },
  };
  context.done();
  return;
};

export default httpTrigger;
