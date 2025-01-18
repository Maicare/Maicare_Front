import * as yup from "yup";




const AddressSchema = yup.object({
  belongs_to: yup.string().required('Belongs to is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zip_code: yup.string().required('Zip code is required'),
  phone_number: yup.string().required('Phone number is required'),
});

export const CreateClientSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  organisation: yup.string().required("Organisation is required"),
  location: yup.string().required("Location is required"),
  legal_measure: yup.string().required("Legal measure is required"),
  birthplace: yup.string().required("Birthplace is required"),
  departement: yup.string().required("Department is required"),
  gender: yup.string().required("Gender is required"),
  filenumber: yup.string().required("File number is required"),
  phone_number: yup.string().required("Phone number is required"),
  bsn: yup.string().required("BSN is required"),
  source: yup.string().required("Source is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  city: yup.string().required("City is required"),
  Zipcode: yup.string().required("Zipcode is required"),
  addresses: yup.array().of(
    yup.object({
      belongs_to: yup.string().optional(),
      address: yup.string().optional(),
      city: yup.string().optional(),
      zip_code: yup.string().optional(),
      phone_number: yup.string().optional(),
    })
  ).required("Addresses are required"),
  infix: yup.string().optional(),
  streetname: yup.string().required("Street name is required"),
  street_number: yup.string().required("Street number is required"),
  added_identity_documents: yup.array().of(yup.string()).optional(),
  removed_identity_documents: yup.array().of(yup.string()).optional(),
  departure_reason: yup.string().optional(),
  departure_report: yup.string().optional(),
});
