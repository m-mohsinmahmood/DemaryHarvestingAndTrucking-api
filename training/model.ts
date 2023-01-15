export interface trainee {
    trainee_id: string;
    trainer_id?: string;
    city?: string;
    state?: string;
    training_type:string;
    topic:string;
    detail: string;
}
export interface trainer{
    trainer_id?: string;
    supervisor_id: string;
    city: string;
    state: string;
    training_type: string;
    topic: string;
    notes: string
}
export interface preTripCheck{
    trainer_id?: string;
    trainee_id: string;
    supervisor_id: string;
    city: string;
    state: string;
    evaluation_form: string;
    is_completed_cdl_classroom: boolean;
    is_completed_group_practical: boolean
}