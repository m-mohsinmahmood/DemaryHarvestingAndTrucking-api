
export function GetTruckingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any) {
    let getDwr;

    let where = ``;

    if (role === 'supervisor')
        where = `${where} AND tdr.dispatcher_id = '${employee_id}'`;
    else
        where = `${where} AND tdr.truck_driver_id = '${employee_id}'`;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr.created_at) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr.created_at) = '${year}'`
    }
    else {
        where = `${where} AND CAST(created_at AS Date) = '${date}'`
    }

    getDwr = `
    select 
    dwr."id" as dwr_id, 
    tdr."id" as order_id, 
    tdr.created_at,
    dwr.hours_worked,
    customers.customer_name
 
    from "DWR" dwr
    
    INNER JOIN "Trucking_Delivery_Ticket" tdr ON dwr.delivery_ticket_id = tdr.id
    INNER JOIN "Customers" customers ON customers.id = tdr.customer_id
                    
    WHERE 
    dwr.is_day_closed= TRUE
    AND dwr.dwr_type = 'trucking'
    ${where}
    ;`;

    return getDwr;
}