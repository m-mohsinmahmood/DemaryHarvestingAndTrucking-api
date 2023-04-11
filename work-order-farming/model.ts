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
    totalAcres: string;
    state: string;
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
    acresCompleted?: number;
    gpsAcres?: string;
    hoursWorked?: string;
    notes?: string;
    totalAcres: string;
    dwr_id:string;
}

export interface InvoicedWorkOrder {
    operation: string;
    customerId?: string;
    serviceType?: string;
    from?: string;
    to?: string;
    quantityType?: string;
    quantity?: string;
    rate?: string;
    amount?: string;
    fieldId?: string;
}

export interface PaidWorkOrder {
    operation: string;
    customerId?: string;
    serviceType?: string;
    from?: string;
    to?: string;
}