export interface applicant {
  id: string,
  first_name: string,
  last_name: string,
  legal_name: string,
  email: string,
  cell_phone_number: string,
  cell_phone_country_code: string,
  home_phone_number: string,
  home_phone_country_code: string,
  date_of_birth: string,
  age: string,
  marital_status: string,
  languages: string,
  rank_speaking_english: string,
  address_1: string,
  address_2: string,
  town_city: string,
  county_providence: string,
  state?: string,
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
  supervisor_name: string,
  supervisor_contact: string,
  degree_name: string,
  reason_for_applying: string,
  hear_about_dht: string,
  first_call_remarks: string,
  first_call_ranking: string,
  first_interviewer_id: string,
  reference_call_remarks: string,
  reference_call_ranking: string,
  reference_interviewer_id: string,
  second_call_remarks: string,
  second_call_ranking: string,
  second_interviewer_id: string,
  third_call_remarks: string,
  third_call_ranking: string,
  third_interviewer_id: string,
  status_step: string,
  status_message: string,
  step_one_status_date: string,
  step_two_status_date: string,
  step_three_status_date: string,
  step_four_status_date: string,
  step_five_status_date: string,
  step_six_status_date: string,
  step_seven_status_date: string,
  step_eight_status_date: string,
  step_nine_status_date: string,
  step_ten_status_date: string,
  step_eleven_status_date: string,
  step_twelve_status_date: string,
  step_thirteen_status_date: string,
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
  current_supervisor_country_code: string,
  current_contact_supervisor: boolean,
  previous_employer: string,
  previous_position_title: string,
  previous_description_of_role: string,
  previous_employment_period_start: string,
  previous_employment_period_end: string,
  previous_supervisor_reference: string,
  previous_supervisor_phone_number: string,
  previous_supervisor_country_code: string,
  previous_contact_supervisor: boolean,
  school_college: string,
  graduation_year: string,
  resume: string,
  applied_job: string,
  whatsapp_number: string,
  whatsapp_country_code: string,
  equipments_experience_description: string,
  device_info: string,
  employee_type:string
}