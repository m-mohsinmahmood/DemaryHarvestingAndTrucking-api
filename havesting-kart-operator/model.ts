export interface delivery_ticket {
    // Required for Delivery Ticket of Harvesting
    id?: string,
    kartOperatorId?:string,
    truckDriverId?: string;
    customerId?: string;
    farmId?: string;
    cropName?:string;
    state?:string;
    destination?:string;
    loadedMiles?:string;
    fieldId?:string;
    splitLoad?:string;
    kartScaleWeight?:string;
    truckId?:string;
}