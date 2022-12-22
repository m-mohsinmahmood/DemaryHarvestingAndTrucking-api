export interface create_ticket{
    truck_id: string,
    destination: string,
    loaded_miles:number,
    field: string,
    split_load_check?: boolean,
    kart_scale_weight: number,
    delivery_ticket_number:string,
    kart_operator:string,
    truck_driver_company:string,
    truck: string,
    status: string,
    working_status: string
    // split_load?: string,
    // kart_scale_weight_split?: number,
    // field_load_split?: number,
}
export interface create_ticket_split{
    truck_id: string,
    destination: string,
    loaded_miles:number,
    field: string,
    split_load_check?: boolean,
    kart_scale_weight: number,
    delivery_ticket_number:string,
    kart_operator:string,
    truck_driver_company:string,
    truck: string,
    split_load: string,
    kart_scale_weight_split: number,
    field_load_split: number,
    status: string,
    working_status: string

}