import Ajv from "ajv"
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors';
import { crop } from "./model";

const ajv = new Ajv({allErrors: true});
addFormats(ajv);
ajvErrors(ajv);

const schema = {
  type: "object",
  required: ["name", "variety", "bushel_weight"],
  properties: {
    name: { type: "string" },
    variety: { type: "string" },
    bushel_weight: { type: "number" },
  },
  errorMessage: {
    // Change from errorMessage to errorMessages
    type: 'should be an object',
    required: {
      name: 'name is missing',
      variety: 'variety is missing',
      bushel_weight: 'bushel weight is missing',
    },
  },
  additionalProperties: false,
};



export function cropValidator(crop: crop) {
  const validate = ajv.compile(schema);
  const valid = validate(crop);
  if (!valid) console.log(validate.errors);
  return validate.errors;
}
