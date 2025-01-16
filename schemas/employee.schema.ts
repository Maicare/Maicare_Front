import * as Yup from "yup";


export const employeeSchema = Yup.object().shape({
    // id: Yup.number(),
    employee_number: Yup.string().required("Medewerkernummer Vereist"),
    employment_number: Yup.string().required("Dienstnummer Vereist"),
    is_subcontractor: Yup.boolean(),
    location_id: Yup.string().required("ALLO"),
    role_id: Yup.string(),
    first_name: Yup.string().required("Geef alstublieft de voornaam op"),
    last_name: Yup.string().required("Geef alstublieft de achternaam op"),
    date_of_birth: Yup.string().required("Geef alstublieft de geboortedatum op"),
    gender: Yup.string().required("Geef alstublieft het geslacht op"),
    email: Yup.string().email().required("Geef alstublieft het e-mailadres op"),
    private_email_address: Yup.string(),
    authentication_phone_number: Yup.string(),
    work_phone_number: Yup.string(),
    private_phone_number: Yup.string(),
    home_telephone_number: Yup.string(),
    out_of_service: Yup.boolean().default(false),
});