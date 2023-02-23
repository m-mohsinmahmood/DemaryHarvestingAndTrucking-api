export interface farmingInvoice {
    customerId: string;
    equipmentType: string;
    // quantityType: string;
    quantity: string;
    rate: string;
    amount: string;
    farmId: string;
    fieldId: string;
    // cropId: string;
}

export interface truckingInvoice {
    customerId: string;
    rateType: string;
    weightLoad: string;
    billingId: string;
    cargo: string;
    destinationCity: string;
    destinationState: string;
}

export interface harvestingInvoice {
    customerId: string;
    serviceType: string;
    farmId: string;
    crop: string;
    // quantityType: string;
    quantity: string;
    rate: string;
    rateType: string;
}