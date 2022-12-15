import { customer } from "./model";
//import { ajv } from "../utilities/validator_intance";

// const schema = {
//   type: "object",
//   required: [
//     "company_name",
//     "main_contact",
//     "position",
//     "phone_number",
//     "state",
//     "country",
//     "email",
//     "customer_type",
//     "status",
//   ],
//   properties: {
//     company_name: { type: "string" },
//     main_contact: { type: "string" },
//     position: { type: "string" },
//     phone_number: { type: "string" },
//     state: { type: "string" },
//     country: { type: "string" },
//     email: { type: "string", format: "email" },
//     customer_type: { type: "string" },
//     status: { type: "boolean" },
//   },
//   errorMessage: {
//     type: "should be an object",
//     required: {
//       company_name: "company name is missing",
//       main_contact: "main contact is missing",
//       position: "position is missing",
//       phone_number: "phone number is missing",
//       state: "state is missing",
//       country: "country is missing",
//       email: "email is missing",
//       customer_type: "customer type is missing",
//       status: "status is missing",
//     },
//   },
//   additionalProperties: false,
// };

export function customerValidator(customer: customer) {
 // const validate = ajv.compile(schema);
 // const valid = validate(customer);
 // if (!valid) console.log(validate.errors);
 // const validation = validate.errors;
  let error = [];
  let errorMessage = ``;
  // validation.forEach((err) => {
  //   error.push(
  //     `${err.instancePath ? `${err.instancePath} ` : ``}${err.message}`.replace(
  //       /[^\w ]/g,
  //       ""
  //     )
  //   );
  // });
  errorMessage = error.join(", ");
  return errorMessage;
}
