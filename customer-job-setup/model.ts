export interface job_setup{
    customer_id?: string,
    farm_id: string,
    crop_id:string,
    state: string,
    field_id: string,
    id?: string,
    employee_id?: string,
    field_id_new?: string,
    total_acres?: string,
    total_gps_acres?: string
    is_field_changed?: boolean,
    has_employee?: boolean
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
    employee_id:string,
    is_close?: boolean,
    is_close_crew?: boolean,
    is_close_combine?: boolean,
    is_close_kart?: boolean,
    // date:string,
    total_acres: number,
    total_gps_acres: number
}