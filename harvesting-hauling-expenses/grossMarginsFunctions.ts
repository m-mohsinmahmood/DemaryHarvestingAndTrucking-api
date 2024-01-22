
export function getHarvestingGrossMargin(customer_id) {

	let where = ``;
	if (customer_id != '')
		where = `WHERE cjs.customer_id = '${customer_id}'`

	let grossMargin = `
        SELECT 
        
		invoiced_job_number,
		farm,
		crop,
		(crop_acres:: FLOAT * combining_rate:: FLOAT) AS revenue
		
        FROM (
                
            SELECT 
				job_setup_name AS invoiced_job_number,
				cjs.created_at,
				cjs.crop_acres AS crop_acres,
				crop.name AS crop,
				
				(
					Select name from "Customer_Farm"
 				
					where id = cjs.farm_id AND is_deleted = FALSE
 				) AS farm,
				
				(
					Select combining_rate from "Combining_Rates"
					
					WHere customer_id = cjs.customer_id AND cjs.farm_id = farm_id AND cjs.crop_id = crop_id AND is_deleted = FALSE 
				) AS combining_rate
			
        FROM 
        "Customer_Job_Setup" cjs
		INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE AND cjs.crop_acres IS NOT NULL AND cjs.crop_acres != '' AND cjs.crop_acres != 'null'

		${where}
            ) AS subquery ORDER BY created_at ASC;
        `;

	return grossMargin;
}

export function getHaulingGrossMargin(customer_id) {
	let where = ``;
	if (customer_id != '')
		where = `WHERE cjs.customer_id = '${customer_id}'`

	let grossMargin = `
	SELECT 
    invoiced_job_number,
    farm,
    crop,
    CASE
        WHEN rate_type = 'Bushels' THEN (weight / bushel_weight) * rate
        WHEN rate_type = 'Bushels + Excess Yield' THEN ((weight / bushel_weight) * premium_rate) + (((weight / bushel_weight) - (crop_acres::NUMERIC * base_bushels)) * premium_rate)
        WHEN rate_type = 'Hundred Weight' THEN (weight / 100) * rate
        WHEN rate_type = 'Miles' THEN loaded_miles * rate
        WHEN rate_type = 'Ton Miles' THEN ((premium_rate * (total_miles / miles_count)) + base_rate) * (weight / 2000)
        WHEN rate_type = 'Tons' THEN (weight / 2000) * rate
        WHEN rate_type = 'Load count' THEN load_count * rate
        ELSE 0
    END AS revenue

	FROM (
    SELECT 
        job_setup_name AS invoiced_job_number,
        cjs.created_at,
        cjs.crop_acres AS crop_acres,
        crop.name AS crop,
        crop.bushel_weight,
        hr.rate_type,
        hr.rate,
        hr.base_rate,
        hr.premium_rate,
        hr.base_bushels,
        hr.customer_id AS hr_customer,
        hr.farm_id hr_farm,
        hr.crop_id AS hr_crop,
        cjs.customer_id AS job_customer_id,
        cjs.id AS job_id,

        (
            SELECT name FROM "Customer_Farm"
            WHERE id = cjs.farm_id AND is_deleted = FALSE
        ) AS farm,
        calculate_weight(cjs.id) AS weight,
        (
            SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0)) FROM "Harvesting_Delivery_Ticket" hdt 
            WHERE hdt.job_id = cjs.id
        ) AS loaded_miles,
        (
            SELECT COUNT(hdt.id) FROM "Harvesting_Delivery_Ticket" hdt 
            WHERE hdt.job_id = cjs.id
        ) AS load_count,
        (
            SELECT SUM(COALESCE(NULLIF(loaded_miles, '')::FLOAT, 0)) FROM "Harvesting_Delivery_Ticket" hdt 
            WHERE hdt.job_id = cjs.id
        ) AS total_miles,
        (
            SELECT COUNT(hdt.id) FROM "Harvesting_Delivery_Ticket" hdt 
            WHERE hdt.job_id = cjs.id
        ) AS miles_count
    
		FROM 
        "Customer_Job_Setup" cjs
        INNER JOIN "Crops" crop ON crop.id = cjs.crop_id AND crop.is_deleted = FALSE AND cjs.crop_acres IS NOT NULL AND cjs.crop_acres != '' AND cjs.crop_acres != 'null'
        INNER JOIN "Hauling_Rates" hr ON cjs.customer_id = hr.customer_id AND cjs.farm_id = hr.farm_id AND cjs.crop_id = hr.crop_id AND hr.is_deleted = FALSE
				
		${where}
	) AS subquery

	ORDER BY created_at ASC;
        `;

	return grossMargin;
}