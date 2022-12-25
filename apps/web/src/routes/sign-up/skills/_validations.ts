import { REQUIRED_ERROR_MESSAGE } from "errors";
import { validateAgainstSchema } from "validations";
import { array, object, string } from "yup";

export type SignUpSkillsData = {
  languages: string[] | FormDataEntryValue;
  application: string[] | FormDataEntryValue;
  tools: string[] | FormDataEntryValue;
};

const validationSchema = object().shape({
  languages: array()
    .of(string())
    .min(1)
    .required(REQUIRED_ERROR_MESSAGE),
  application: array()
    .of(string())
    .min(1)
    .required(REQUIRED_ERROR_MESSAGE),
  tools: array()
    .of(string())
    .required(REQUIRED_ERROR_MESSAGE),
});

export const validate = (data: SignUpSkillsData) => validateAgainstSchema(validationSchema, data);