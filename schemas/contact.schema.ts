import { OP_CLIENT_TYPE } from "@/types/contacts.types";
import * as Yup from "yup";

export const OpOrgContactFormSchema = Yup.object().shape({
    types: Yup.string().oneOf(OP_CLIENT_TYPE).required(),
    name: Yup.string().required("Naam is verplicht"),
    address: Yup.string().required("Adres is verplicht"),
    postal_code: Yup.string().required("Postcode is verplicht"),
    place: Yup.string().required("Plaats is verplicht"),
    land: Yup.string().required("Land is verplicht"),
    contacts: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required("Naam is verplicht"),
                email: Yup.string().email("Email is niet geldig").required("Email is verplicht"),
                phone_number: Yup.string().required("Telefoonnummer is verplicht"),
            })
        )
        .required("Contacten zijn verplicht"),
    kvknumber: Yup.string().required("KvK nummer is verplicht"),
    btwnumber: Yup.string().required("BTW nummer is verplicht"),
    phone_number: Yup.string().required("Telefoonnummer is verplicht"),
    client_number: Yup.string().required("Clientnummer is verplicht"),
});