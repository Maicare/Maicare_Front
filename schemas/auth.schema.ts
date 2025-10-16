import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Voer een geldig e-mailadres in")
    .required("E-mail is verplicht"),
  password: yup
    .string()
    .min(6, "Wachtwoord moet minimaal 6 tekens lang zijn")
    .required("Wachtwoord is verplicht"),
});