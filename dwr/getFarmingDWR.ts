
export function GetFarmingDwr(employee_id: any, date: any, dateType: any, month: any, year: any, role: any) {

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
        Select 
        dwr."id" as dwr_id, 
        fwo."id" as order_id, 
        fwo.created_at,
        dwr.hours_worked,
        customers.customer_name,
        farm."name" as farm_name,
        field."name" as field_name
	
        from "DWR" dwr 
	
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