interface field_attributes{
    name: string;
    acres: number;
    calendar_year: string;
    status: boolean;
}
export interface field{
    id?: string;
    customer_id: string;
    farm_id: string;
    name: string;
    acres: number;
    calendar_year: string;
    status: boolean;
}
export interface multipleFields{
    customer_id: string;
    farm_id: string;
    fields: field_attributes[]
}