export interface machinery {
    id?: string;
    type: string;

    company_id: string;
    color: string;
    year: string;
    make: string;
    model: string;

    serial_number:string;
    engine_hours: string;
    eh_reading: string;
    separator_hours: string;
    sh_reading: string;

    insurance_status: string;
    liability: string;
    collision: string;
    comprehensive: string;
    purchase_price: string;
    date_of_purchase: string;
    sales_price: string;
    date_of_sales: string;
    estimated_market_value: string;
    source_of_market_value: string;
    date_of_market_value: string;
    name:string;
    pictures: string;
    status:boolean;
}