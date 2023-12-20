export interface dwr {
    id?: string;
    employeeId?: string;
    module?: string;
    role?: string;
    moduleToRedirect?: string;
}

export interface editDWR {
    id?: string;
    employeeId: string;
    begining_day: string;
    ending_day: string;
    state: string;
    status: string;
    supervisorId: string;

}