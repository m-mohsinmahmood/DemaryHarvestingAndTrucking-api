export interface job_setup{
    customer_id?: string,
    farm_id: string,
    crop_id:string,
    state: string,
    field_id: string,
    id?: string,
    // customer_name:string,
    // farm_name:string,
    // field_name:string,
    // crop_name: string,
}
export interface job_update{
    customer_id:string,
    farm_id: string,
    crop_id:string
}
export interface job_close{
    customer_id:string,
    is_close: boolean,
    date:string,
    total_acres: number,
    total_gps_acres: number
}