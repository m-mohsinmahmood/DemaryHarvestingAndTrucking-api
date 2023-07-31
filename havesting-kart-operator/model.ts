export interface delivery_ticket {
    farmers_bin_weight: any;
    // Required for Delivery Ticket of Harvesting
    id?: string,
    kartOperatorId?: string,
    truckDriverId?: string;
    customer_id?: string;
    farm_id?: string;
    crop_id?: string;
    state?: string;
    destination?: string;
    loadedMiles?: string;
    fieldId?: string;
    splitLoad?: string;
    kartScaleWeight?: string;
    field_load_split?: string;
    split_load_check?: boolean;
    kart_scale_weight_split?: string;
    jobId?: string;
    deliveryTicketNumber?: string;
    destinationId?: string;
}