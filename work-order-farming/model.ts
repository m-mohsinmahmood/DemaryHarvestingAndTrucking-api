export interface workOrder {
    id?: string;
    dispatcherId: string;
    cBeginningEngineHours: string;
    customerId: string;
    farmId: string;
    fieldId: string;
    service: string,
    machineryID: string;
    tractorDriverId: string;
    fieldAddress: string;
    phone: string;
    workOrderIsCompleted?: boolean;
    workOrderStatus?: boolean;
    workOrderCloseOut?: boolean;
}

export interface UpdateWorkOrder {
    id?: string;
    customerId: string;
    acresByService: string;
    endingEngineHours: string;
    gpsAcresByService: string;
}