export function updateActionRequired(resp) {

    if (
    (resp.status_step == 3 && resp.passport_disclaimer == true && resp.foreign_driver_license_disclaimer == true)||
    (resp.status_step == 5 && resp.cdl_training_disclaimer == true) ||
    (resp.status_step == 7 &&  resp.work_agreement_disclaimer == true && resp.itinerary_disclaimer == true && resp.rules_disclaimer == true && resp.handbook_disclaimer == true && resp.reprimand_policy_disclaimer == true && resp.drug_policy_disclaimer == true && resp.equipment_policy_disclaimer == true && resp.departure_disclaimer == true) ||
    (resp.status_step == 9 &&  resp.contract_disclaimer == true) || 
    (resp.status_step == 11 && resp.bank_acc_disclaimer == true) || 
    (resp.status_step == 13 && resp.visa_interview_disclaimer == true && resp.b797_disclaimer == true) ||
    (resp.status_step == 15 && resp.approval_letter_disclaimer == true) ||
    (resp.status_step == 17 && resp.visa_disclaimer == true) || 
    (resp.status_step == 19 && resp.dot_physical_disclaimer == true && resp.drug_test_disclaimer == true && resp.i9_disclaimer == true && resp.i94_disclaimer == true && resp.cert_disclaimer == true) || 
    (resp.status_step == 21 && resp.social_sec_disclaimer == true ) || 
    (resp.status_step == 23 && resp.american_license_disclaimer == true) 
    ){
        return true;
    }
    else 
        return false;

}
