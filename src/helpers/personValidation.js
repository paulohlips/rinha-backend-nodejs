import { object, string, array } from 'yup'

export const personSchema = object({
  apelido : string().max(32).required().strict(),
  nome :  string().defined().max(100).required().strict(),
  nascimento : string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the "YYYY-MM-DD" format')
    .required('Date is required'),
  stack : array().of(string())
})
