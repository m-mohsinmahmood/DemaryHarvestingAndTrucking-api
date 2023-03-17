
export function GetTrainingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any, operation) {

    let getDwr;

    let where = ``;

    if (role === 'supervisor')
        where = `${where} AND fwo.dispatcher_id = '${employee_id}'`;
    else
        where = `${where} AND fwo.tractor_driver_id = '${employee_id}'`;

    if (dateType === 'month') {
        where = `${where} AND EXTRACT(MONTH FROM dwr.created_at) = '${month}'`
        where = `${where} AND EXTRACT(YEAR FROM dwr.created_at) = '${year}'`
    }
    else {
        where = `${where} AND CAST(created_at AS Date) = '${date}'`
    }

    getDwr = `
    select 
 
    DISTINCT dwr_employees."id" as dwr_id,
    dwr.dwr_type,
    dwr_employees.created_at
	
        INNER JOIN "Farming_Work_Order" fwo ON dwr.work_order_id = fwo.id
        INNER JOIN "Customers" customers ON customers."id" = fwo.customer_id
        INNER JOIN "Customer_Farm" farm ON farm."id" = fwo.farm_id
        INNER JOIN "Customer_Field" field ON field."id" = fwo.field_id
                    
        WHERE 
        dwr.is_day_closed= TRUE
        AND dwr.dwr_type = 'farming'
        ${where}
        ;`;

    return getDwr;
}