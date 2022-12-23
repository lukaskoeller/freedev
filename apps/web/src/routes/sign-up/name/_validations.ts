import { REQUIRED_ERROR_MESSAGE } from "errors";
import { validateAgainstSchema } from "validations";
import { object, string } from "yup";

export type SignUpNameData = {
  handle: string | FormDataEntryValue;
  firstName: string | FormDataEntryValue;
  lastName: string | FormDataEntryValue;
};

const validationSchema = object().shape({
  handle: string()
    .required(REQUIRED_ERROR_MESSAGE),
  firstName: string()
    .required(REQUIRED_ERROR_MESSAGE),
  lastName: string()
    .required(REQUIRED_ERROR_MESSAGE),
});

export const validate = (data: SignUpNameData) => validateAgainstSchema(validationSchema, data);