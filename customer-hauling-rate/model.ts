export interface hauling_rate {
    id?: string;
    customer_id: string;
    farm_id: string;
    crop_id: string;
    rate_type: string;
    rate: number;
    base_rate: number;
    premium_rate: number;
    base_bushels: number;
    hauling_fuel_cost: number;
    truck_fuel_cost: number;
}