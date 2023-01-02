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
    load?:string;
    loadDate?:string;
    destinationEndingnOdometerReading?:string;
    homeBeginingOdometerReading?:string;
    originBeginingOdometerReading:string;
}