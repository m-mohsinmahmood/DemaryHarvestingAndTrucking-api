export interface workOrder {
    id?: string;
    dispatcherId: string;
    beginningEngineHours?: string;
    customerId: string;
    farmId: string;
    fieldId: string;
    service: string,
    machineryID?: string;
    tractorDriverId: string;
    fieldAddress: string;
    phone: string;
    workOrderIsCompleted?: boolean;
    workOrderStatus?: boolean;
    workOrderCloseOut?: boolean;
    role?: string;
    completeInfo: boolean;
    totalAcres:string;
}

export interface UpdateWorkOrder {
    workOrderId?: string,
    dispatcherId?: string,
    farmId?: string,
    fieldId?: string,
    service?: string,
    beginningEngineHours?: string;
    tractorDriverId?: string,
    fieldAddress?: string,
    phone?: string,
    role: string,
    machineryID?: string,
    customerId: string;
    acresByService?: string;
    endingEngineHours?: string;
    gpsAcresByService?: string;
    work_order_close_out?: boolean,
    work_order_is_completed?: boolean,
    work_order_status?: boolean;
    searchClause?: string;
    isActive?: boolean;
    acresCompleted?: string;
    gpsAcres?: string;
    hoursWorked?: string;
    notes?: string;
    totalAcres:string;
}