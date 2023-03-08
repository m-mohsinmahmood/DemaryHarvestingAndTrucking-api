export interface JobResult {
    // Farming Job Result
    service?: string;
    customer_id?: string;
    farm_id?: string;
    field_id?: string;
    acres?: string;
    gps_acres?: string;
    engine_hours?: string;
    job_type?: string;
    dispatcher_id?: string;
}

export interface editCustomerJob{
    id: string;
    load_date: string;
    disp_first_name: string;
    disp_last_name: string;
    dr_first_name: string;
    driver_lname: string;
    cargo: string;
    dest_city: string;
    destination_state: string;
    status: string;
    customerId: string;
    total_job_miles: string;
    weightLoad: string;
    hours_worked: string;
}

export interface editFarmingJob{
    id: string;
    date: string;
    farm_name: string;
    field_name: string;
    acres: string;
    gps_acres: string;
    service: string;
    start_time: string;
    end_time: string;
    status: string;
    engine_hours: string;
    customerId: string;
    hours_worked: string;
    acres_completed: string;
}