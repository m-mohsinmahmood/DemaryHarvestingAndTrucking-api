import parseMultipartFormData from "@anzp/azure-function-multipart";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { Client } from "pg";
import { config } from "../services/database/database.config";
import { DeliveryTicket } from "./model";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const db = new Client(config);
    const db1 = new Client(config);

    let image_1 = '';
     let image_2 = '';
     let image_3 = '';
     let result;
     let record_id;
  const multiPartConfig = {
    limits: { fields: 1, files: 3 },
  };
  const { fields, files } = await parseMultipartFormData(req, multiPartConfig);
  const order: DeliveryTicket = (JSON.parse(fields[0].value));

    try {
        // const order: DeliveryTicket = req.body;

        let query = ``;
        let optionalReq: string = ``;
        let optionalValues: string = ``;

        if (order.load != null) {
            optionalReq = `${optionalReq},"load"`;
            optionalValues = `${optionalValues},'${order.load}'`
        }

        if (order.loadDate != null) {
            optionalReq = `${optionalReq},"load_date"`;
            optionalValues = `${optionalValues},'${order.loadDate}'`
        }

        if (order.destinationEndingnOdometerReading != null) {
            optionalReq = `${optionalReq},"destination_ending_OMR"`;
            optionalValues = `${optionalValues},'${order.destinationEndingnOdometerReading}'`
        }

        if (order.homeBeginingOdometerReading != null) {
            optionalReq = `${optionalReq},"home_beginning_OMR"`;
            optionalValues = `${optionalValues},'${order.homeBeginingOdometerReading}'`
        }

        if (order.originBeginingOdometerReading != null) {
            optionalReq = `${optionalReq},"origin_beginning_OMR"`;
            optionalValues = `${optionalValues},'${order.originBeginingOdometerReading}'`
        }

        if (order.truckNo != null) {
            optionalReq = `${optionalReq},"truck_id"`;
            optionalValues = `${optionalValues},'${order.truckNo}'`
        }

        if (order.deadHeadMiles != null) {
            optionalReq = `${optionalReq},"dead_head_miles"`;
            optionalValues = `${optionalValues},'${order.deadHeadMiles}'`
        }

        if (order.totalJobMiles != null) {
            optionalReq = `${optionalReq},"total_job_miles"`;
            optionalValues = `${optionalValues},'${order.totalJobMiles}'`
        }

        if (order.totalTripMiles != null) {
            optionalReq = `${optionalReq},"total_trip_miles"`;
            optionalValues = `${optionalValues},'${order.totalTripMiles}'`
        }

        if (order.truckDriverNotes != null) {
            optionalReq = `${optionalReq},"truck_driver_notes"`;
            optionalValues = `${optionalValues},'${order.truckDriverNotes}'`
        }

        if (order.dispatcherNotes != null) {
            optionalReq = `${optionalReq},"dispatcher_notes"`;
            optionalValues = `${optionalValues},'${order.dispatcherNotes}'`
        }

        if (order.rateType != null) {
            optionalReq = `${optionalReq},"rate_type"`;
            optionalValues = `${optionalValues},'${order.rateType}'`
        }

        if (order.originEmptyWeight != null) {
            optionalReq = `${optionalReq},"originEmptyWeight"`;
            optionalValues = `${optionalValues},'${order.originEmptyWeight}'`
        }

        if (order.originLoadedWeight != null) {
            optionalReq = `${optionalReq},"originLoadedWeight"`;
            optionalValues = `${optionalValues},'${order.originLoadedWeight}'`
        }

        if (order.originWeightLoad != null) {
            optionalReq = `${optionalReq},"originWeightLoad"`;
            optionalValues = `${optionalValues},'${order.originWeightLoad}'`
        }

        if (order.destinationLoadedWeight != null) {
            optionalReq = `${optionalReq},"destinationLoadedWeight"`;
            optionalValues = `${optionalValues},'${order.destinationLoadedWeight}'`
        }

        if (order.destinationEmptyWeight != null) {
            optionalReq = `${optionalReq},"destinationEmptyWeight"`;
            optionalValues = `${optionalValues},'${order.destinationEmptyWeight}'`
        }

        if (order.weightLoad != null) {
            optionalReq = `${optionalReq},"weightLoad"`;
            optionalValues = `${optionalValues},'${order.weightLoad}'`
        }

        if (order.scaleTicket != null) {
            optionalReq = `${optionalReq},"scaleTicket"`;
            optionalValues = `${optionalValues},'${order.scaleTicket}'`
        }

        if (order.destinationDeliveryLoad != null) {
            optionalReq = `${optionalReq},"destinationDeliveryLoad"`;
            optionalValues = `${optionalValues},'${order.destinationDeliveryLoad}'`
        }

        if (order.cropId != null) {
            optionalReq = `${optionalReq},"crop_id"`;
            optionalValues = `${optionalValues},'${order.cropId}'`
        }

        if (order.hoursWorked != null) {
            optionalReq = `${optionalReq},"hours_worked"`;
            optionalValues = `${optionalValues},'${order.hoursWorked}'`
        }

        // If Dispatcher will create a New Delivery Ticket then below given query will be executed.
        query = `
            INSERT INTO 
                        "Trucking_Delivery_Ticket" 
                        ("dispatcher_id", 
                        "truck_driver_id", 
                        "cargo", 
                        "origin_city",
                        "destination_city", 
                        "destination_state", 
						"customer_id",
						"trucking_type",
						"ticket_status",
                        "is_ticket_info_completed"
                        ${optionalReq})
      
            VALUES      ('${order.dispatcherId}', 
                        '${order.driverId}', 
                        '${order.cargo}', 
                        '${order.originCity}', 
                        '${order.destinationCity}',
                        '${order.destinationState}', 
                        '${order.customerId}', 
						'${order.truckingType}',
                        '${order.ticketStatus}',
                        '${order.isTicketInfoCompleted}'
                        ${optionalValues}
                        )
                        RETURNING id as record_id
                        ;
          `;

        console.log(query);

        db.connect();
        result =  await db.query(query);
        db.end();

    } catch (error) {
        db.end();
        context.res = {
            status: 500,
            body: {
                status: 500,
                message: error.message,
            },
        };
        return;
    }
    //#region Upload
   if(files.length !==0){
    try {
        record_id = result.rows[0].record_id;
        const blob = new BlobServiceClient("https://dhtstorageaccountdev.blob.core.windows.net/trucking?sp=rawl&st=2023-03-03T13:04:54Z&se=2025-02-28T21:04:54Z&spr=https&sv=2021-06-08&sr=c&sig=c5MCP4K9Xyz19cTw7yt2sYez4Y9GiVZy4mBNgtzba4s%3D")
    const container = blob.getContainerClient("trucking");
     files.map( async (file)=>{
        if(file.name === "image_1"){
            image_1 = "image_1" + record_id;
        const imageBlockBlob = container.getBlockBlobClient(image_1);
        const res = await imageBlockBlob.uploadData(files[0].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[0].mimeType },
        });
        }
        if(file.name === "image_2"){
            image_2 = "image_2" + record_id;
        const imageBlockBlob = container.getBlockBlobClient(image_2);
        const res = await imageBlockBlob.uploadData(files[0].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[0].mimeType },
        });
        }
        if(file.name === "image_3"){
            image_3 = "image_3" + record_id;
        const imageBlockBlob = container.getBlockBlobClient(image_3);
        const res = await imageBlockBlob.uploadData(files[0].bufferFile, {
          blobHTTPHeaders: { blobContentType: files[0].mimeType },
        });
        }
     })
    //   if (files[0]){
    //     image_1 = "image_1" + record_id;
    //     const imageBlockBlob = container.getBlockBlobClient(image_1);
    //     const res = await imageBlockBlob.uploadData(files[0].bufferFile, {
    //       blobHTTPHeaders: { blobContentType: files[0].mimeType },
    //     });
    //   }
      
    //   if (files[1]){
    //     image_2 = "image_2" + record_id;
    //     const imageBlockBlob = container.getBlockBlobClient(image_2);
    //     const res = await imageBlockBlob.uploadData(files[1].bufferFile, {
    //       blobHTTPHeaders: { blobContentType: files[1].mimeType },
    //     });
    //   }
    //   if (files[2]){
    //     image_3 = "image_3" + record_id;
    //     const imageBlockBlob = container.getBlockBlobClient(image_3);
    //     const res = await imageBlockBlob.uploadData(files[2].bufferFile, {
    //       blobHTTPHeaders: { blobContentType: files[2].mimeType },
    //     });
    //   }
    }
    catch (error) {
      context.res = {
        status: 400,
        body: {
          message: "An error occured while creating the Tickettt",
        },
      };
      context.done();
      return;
    }

  }
//#endregion
//#region delivery ticket trucking
if(files.length !==0){
    try {
      let query = `
      UPDATE "Trucking_Delivery_Ticket"
      SET `;
      let namesArray = []
      for (let index = 0; index < files.length; index++) {
        namesArray.push(files[index].name)
       if(files[index].name === 'image_1'){
            query = query + `"image_1" = '${'https://dhtstorageaccountdev.blob.core.windows.net/trucking/trucking/' + image_1}'`
        }
    if (namesArray.includes("image_1") && namesArray.includes("image_2")) query = query + ", "
    if (namesArray.includes("image_1") && namesArray.includes("image_3")) query = query + ", "
        if(files[index].name === 'image_2'){
            query = query + `"image_2" = '${'https://dhtstorageaccountdev.blob.core.windows.net/trucking/trucking/' + image_2}'` 
        }
    if (namesArray.includes("image_2") && namesArray.includes("image_3")) query = query + ", "

        if(files[index].name === 'image_3'){
            query = query + `"image_3" = '${'https://dhtstorageaccountdev.blob.core.windows.net/trucking/trucking/' + image_3}'` 
        }
      }

      query = query + `WHERE "id" = '${record_id}';`
      console.log('QUERY::',query);
      db1.connect();
      await db1.query(query);
      db1.end();
    } catch (error) {
      db1.end();
      context.res = {
        status: 400,
        body: {
          message: "An error occured while creating the tickett",
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
