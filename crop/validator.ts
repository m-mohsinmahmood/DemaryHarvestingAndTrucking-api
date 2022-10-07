import { crop } from "./model";
import { ajv } from "../utilities/validator_intance";

const schema = {
  type: "object",
  required: ["name", "variety", "bushel_weight"],
  properties: {
    name: { type: "string" },
    variety: { type: "string" },
    bushel_weight: { type: "number" },
  },
  errorMessage: {
    type: "should be an object",
    required: {
      name: "name is missing",
      variety: "variety is missing",
      bushel_weight: "bushel weight is missing",
    },
  },
  additionalProperties: false,
};

export function cropValidator(crop: crop) {
  const validate = ajv.compile(schema);
  const valid = validate(crop);
  if (!valid) console.log(validate.errors);
  const validation = validate.errors;
  let error = [];
  let errorMessage = ``;
  validation.forEach((err) => {
    error.push(
      `${err.instancePath ? `${err.instancePath} ` : ``}${err.message}`.replace(
        /[^\w ]/g,
        ""
      )
    );
  });
  errorMessage = error.join(", ");
  return errorMessage;
}
