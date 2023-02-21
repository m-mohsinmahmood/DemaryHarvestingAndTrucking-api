// export interface create_ticket{
//     truck_driver_id: string,
//     destination: string,
//     loaded_miles:number,
//     // field: string,
//     split_load_check?: boolean,
//     kart_scale_weight: number,
//     delivery_ticket_number:string,
//     kart_operator_id:string,
//     truck_driver_company:string,
//     truck_id: string,
//     status: string,
//     working_status: string,
//     state: string,
//     farm_id: string,
//     crop_id: string,
//     field_id: string,
//     customer_id:string
//     // split_load?: string,
//     // kart_scale_weight_split?: number,
//     // field_load_split?: number,
// }
// export interface create_ticket_split{
//     truck_driver_id: string,
//     destination: string,
//     loaded_miles:number,
//     // field: string,
//     split_load_check?: boolean,
//     kart_scale_weight: number,
//     delivery_ticket_number:string,
//     kart_operator_id:string,
//     truck_driver_company:string,
//     truck_id: string,
//     split_load: string,
//     kart_scale_weight_split: number,
//     field_load_split: number,
//     status: string,
//     working_status: string,
//     state: string,
//     farm_id: string,
//     crop_id: string,
//     field_id: string,
//     customer_id:string
// }
// export interface ticket_update{
//     scale_ticket: number,
//       scale_ticket_weight: number,
//       test_weight: number,
//       protein_content: number,
//       moisture_content: number,
//     //   scale_ticket_docs: string,
//     //   scale_ticket_weight_docs: string,
//       status:string,
// }
// export interface ticket_update_kart{
//       status:string,
// }
// export interface ticket_reassign{
//   status:string,
//   truck_driver_id: string
// }

export interface UpdateHarvestingTicket {
  operation?: string;
  ticketId?: string;
  ticketStatus?: string;
  farmId?: string;
  cropName?: string;
  destination?: string;
  fieldId?: string;
  scaleTicketWeight?: String;
  testWeight?: string;
  proteinContent?: string;
  moistureContent?: String;
  image_1: string;
  image_2: string;
}