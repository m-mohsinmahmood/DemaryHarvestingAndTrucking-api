import * as Joi from "Joi";
import { crop } from "./model";

const schema = Joi.object({
  name: Joi.string().required(),
  variety: Joi.string().required(),
  bushel_weight: Joi.string().required(),
});

export function cropValidator(crop: crop) {
  const { value, error } = schema.validate(crop, { abortEarly: false, errors: {
    wrap: {
      label: ''
    }
  } });
  return error;
}
