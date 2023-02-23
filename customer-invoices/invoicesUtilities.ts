
export function getTruckingJobResult(from: any, to: any, customerId: any) {

    let whereClause = ``;

    if (from) whereClause = ` ${whereClause}  AND '${from}' <= created_at::"date"`;
    if (to) whereClause = ` ${whereClause}  AND '${to}' >= created_at::"date"`;

    let query = `
    Select tr.rate_type, tr.rate, (SUM(CAST("weightLoad" AS float))) * tr.rate AS total_amount 
    from "Trucking_Delivery_Ticket" tdt INNER JOIN "Trucking_Rates" tr ON tdt.rate_type = tr.id AND tr.rate_type = 'Pounds'
    where tdt.trucking_type = 'commercial' AND tdt.status = 'verified' AND tdt.is_deleted = false ${whereClause}
    GROUP BY tr.rate, tr.rate_type, tr.rate;

    Select tr.rate_type, tr.rate, (SUM(CAST("weightLoad" AS float))/112) * tr.rate AS total_amount 
    from "Trucking_Delivery_Ticket" tdt INNER JOIN "Trucking_Rates" tr ON tdt.rate_type = tr.id AND tr.rate_type = 'Hundred Weight'
    where tdt.trucking_type = 'commercial' AND tdt.status = 'verified' AND tdt.is_deleted = false ${whereClause}
    GROUP BY tr.rate, tr.rate_type, tr.rate;

    Select tr.rate_type, tr.rate, (SUM(CAST("hours_worked" AS float))) * tr.rate AS total_amount 
    from "Trucking_Delivery_Ticket" tdt INNER JOIN "Trucking_Rates" tr ON tdt.rate_type = tr.id AND tr.rate_type = 'Hours'
    where tdt.trucking_type = 'commercial' AND tdt.customer_id = '${customerId}' AND tdt.status = 'verified' AND tdt.is_deleted = false ${whereClause}
    GROUP BY tr.rate, tr.rate_type, tr.rate, tdt.customer_id;

    Select tr.rate_type, tr.rate, (SUM(CAST("weightLoad" AS float))/2000) * tr.rate AS total_amount 
    from "Trucking_Delivery_Ticket" tdt INNER JOIN "Trucking_Rates" tr ON tdt.rate_type = tr.id AND tr.rate_type = 'Tons' AND tdt.customer_id = '${customerId}'
    where tdt.trucking_type = 'commercial' AND tdt.status = 'verified' AND tdt.is_deleted = false ${whereClause}
    GROUP BY tr.rate, tr.rate_type, tr.rate;

    Select tr.rate_type, tr.rate, (SUM(CAST("weightLoad" AS float))/(SELECT bushel_weight from "Crops" where id = (Select crop_id from "Trucking_Delivery_Ticket" WHERE customer_id = '${customerId}' AND crop_id <> null LIMIT 1 ))) * tr.rate AS total_amount 
    FROM "Trucking_Delivery_Ticket" tdt INNER JOIN "Trucking_Rates" tr ON tdt.rate_type = tr.id AND tr.rate_type = 'Bushels' AND tdt.customer_id = '${customerId}'
    WHERE tdt.trucking_type = 'commercial' AND tdt.status = 'verified' AND tdt.is_deleted = false
    GROUP BY tr.rate, tr.rate_type, tr.rate;

    Select tr.rate_type, tr.rate, tr.rate as total_amount
    from "Trucking_Delivery_Ticket" tdt INNER JOIN "Trucking_Rates" tr ON tdt.rate_type = tr.id AND tr.rate_type = 'Flat Rate'
    where tdt.customer_id = '${customerId}' AND  trucking_type = 'commercial' AND tdt.status = 'verified' AND tdt.is_deleted = false; ${whereClause}
    `
    return query;
}