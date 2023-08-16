export interface employee {
  id: string,
  first_name: string,
  last_name: string,
  legal_name: string,
  role: string,
  status: boolean,
  email: string,
  cell_phone_number: string,
  home_phone_number: string,
  date_of_birth: string,
  age: string,
  marital_status: string,
  languages: string,
  rank_speaking_english: string,
  address_1: string,
  address_2: string,
  town_city: string,
  county_providence: string,
  state: string,
  postal_code: string,
  country: string,
  avatar: string,
  question_1: string,
  question_2: string,
  question_3: string,
  question_4: string,
  question_5: string,
  authorized_to_work: boolean,
  us_citizen: boolean,
  cdl_license: boolean,
  lorry_license: boolean,
  tractor_license: boolean,
  passport: boolean,
  work_experience_description: string,
  employment_period: string,
  applied_job: string,
  supervisor_name: string,
  supervisor_contact: string,
  degree_name: string,
  reason_for_applying: string,
  hear_about_dht: string,
  reason_for_rejection: string,
  unique_fact: string,
  ranking: string,
  current_employer: string,
  current_position_title: string,
  current_description_of_role: string,
  current_employment_period_start: string,
  current_employment_period_end: string,
  current_supervisor_reference: string,
  current_supervisor_phone_number: string,
  current_contact_supervisor: boolean,
  previous_employer: string,
  previous_position_title: string,
  previous_description_of_role: string,
  previous_employment_period_start: string,
  previous_employment_period_end: string,
  previous_supervisor_reference: string,
  previous_supervisor_phone_number: string,
  previous_contact_supervisor: boolean,
  school_college: string,
  graduation_year: string,
  resume: string,
  status_step: string,
  status_message: string,
  current_supervisor_country_code: string,
  previous_supervisor_country_code: string,
  cell_phone_country_code: string,
  home_phone_country_code: string,
}

export interface guestEmployee {
  first_name: string,
  last_name: string,
  email: string,
  employee_role: string,
  employee_company: string,
  machinery: string
}