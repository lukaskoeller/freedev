import { REQUIRED_ERROR_MESSAGE } from "errors";
import { validateAgainstSchema, validateIsEmail } from "validations";
import { object, string } from "yup";

export type FieldErrors = Map<string, string>;

export type SignUpData = {
  email: string | FormDataEntryValue;
  password: string | FormDataEntryValue;
};

const validationSchema = object().shape({
  email: string()
    .test('email', 'Please provide a valid email.', validateIsEmail)
    .required(REQUIRED_ERROR_MESSAGE),
  password: string().required(REQUIRED_ERROR_MESSAGE),
});

export const validate = (data: SignUpData) => validateAgainstSchema(validationSchema, data);