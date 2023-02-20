export interface DeliveryTicket {
    dispatcherId: string;
    driverId: string;
    cargo: string;
    originCity: string;
    destinationCity: string;
    destinationState: string;
    dispatcherNotes: string;
    customerId: string;
    truckingType: boolean;
    ticketStatus: boolean;
    role: string;
    load?: string;
    loadDate?: string;
    destinationEndingnOdometerReading?: string;
    homeBeginingOdometerReading?: string;
    originBeginingOdometerReading: string;
    truckNo?: string,
    deadHeadMiles?: string,
    totalJobMiles?: string,
    totalTripMiles?: string,
    truckDriverNotes?: string,
    rateType?: string;
    originEmptyWeight?: string;
    originLoadedWeight?: string;
    originWeightLoad?: string;
    destinationLoadedWeight?: string;
    destinationEmptyWeight?: string;
    weightLoad?: string
    scaleTicket?: string;
    destinationDeliveryLoad?: string;
    isTicketInfoCompleted: boolean

}

export interface UpdateDeliveryTicket {
    truckNo?: string,
    ticketNo?: string,
    homeBeginingOdometerReading?: string,
    originBeginingOdometerReading?: string,
    destinationEndingOdometerReading?: string,
    deadHeadMiles?: string,
    totalJobMiles?: string,
    totalTripMiles?: string,
    notes?: string,
    ticketStatus: boolean;
    truckDriverNotes?: string
    destinationDeliveryLoad?: string;
    destinationEmptyWeight?: string;
    destinationLoadedWeight?: string;
    originEmptyWeight?: string;
    originLoadedWeight?: string;
    originWeightLoad?: string;
    scaleTicket?: string;
    weightLoad?: string;
    isTicketActive?: boolean;
    isTripCheckFilled?: boolean;
    isTicketInfoCompleted?: boolean;
    begining_odometer_miles?: string;
    ending_odometer_miles?: string;
    hoursWorked?: string;
}