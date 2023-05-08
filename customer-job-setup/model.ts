export interface job_setup {
    id?: string,
    customer_id?: string;
    farm_id: string;
    crop_id: string;
    state: string;
    field_id: string;
    crew_chief_id?: string;
    combine_operator_id?: string;
    truck_driver_id?: string;
    cart_operator_id?: string;
    changeFarmFieldCrop?: boolean;
    closeJob?: boolean;
    newJobSetup?: boolean;
    total_acres?: string;
    total_gps_acres?: string;
    job_id?: string;
    employee_id?: string;
    director_id?: string;
}
export interface job_update {
    id?:string,
    customer_id: string;
    farm_id: string;
    crop_id: string
}
export interface job_close {
    customer_id: string;
    employeeId: string;
    is_close?: boolean;
    is_close_crew?: boolean;
    is_close_combine?: boolean;
    is_close_kart?: boolean;
    total_acres: number;
    total_gps_acres: number
}