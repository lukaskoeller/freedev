import { ONLY_NUMBER_ERROR_MESSAGE, REQUIRED_ERROR_MESSAGE } from "errors";
import { validateAgainstSchema } from "validations";
import { date, object, string } from "yup";

export type SignUpConditionsData = {
  hourlyRate: string | FormDataEntryValue;
  availableFrom: string | FormDataEntryValue;
  capacity: string | FormDataEntryValue;
  customCapacity: string | FormDataEntryValue;
};

const validationSchema = object().shape({
  hourlyRate: string()
    .matches(/^\d+$/, ONLY_NUMBER_ERROR_MESSAGE)
    .required(REQUIRED_ERROR_MESSAGE),
  availableFrom: date()
    .nullable()
    .default(undefined)
    .transform((curr, orig) => orig === '' ? null : curr)
    .required(REQUIRED_ERROR_MESSAGE),
  capacity: string()
    .nullable()
    // .when('capacity', {
    //   is: 'custom',
    //   then: (schema) => schema.required(REQUIRED_ERROR_MESSAGE),
    //   otherwise: (schema) => schema.matches(/^\d+$/, ONLY_NUMBER_ERROR_MESSAGE),
    // })
    .required(REQUIRED_ERROR_MESSAGE),
  customCapacity: string()
    .matches(/^\d+$/, ONLY_NUMBER_ERROR_MESSAGE)
    .when('capacity', {
      is: 'custom',
      then: (schema) => schema.nullable().required(REQUIRED_ERROR_MESSAGE),
      otherwise: (schema) => schema.nullable().optional(),
    }),
});

export const validate = (data: SignUpConditionsData) => validateAgainstSchema(validationSchema, data);