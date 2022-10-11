export interface customer_farm_field{
    farm_id?: string;
    customer_id: string;
    farm: string;
    fields: field[];
}

export interface field{
    id?: string;
    name: string;
    acres: number;
    calendar_year: string;
}