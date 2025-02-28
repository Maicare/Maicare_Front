"use client";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import Routes from "@/common/routes";
import Panel from "@/components/common/Panel/Panel";
import { FormProvider, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import Button from "@/components/common/Buttons/Button";
import { IntakeFormType } from "@/types/intake.types";
import { useIntake } from "@/hooks/intake/use-intake";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { IntakeFormSchema } from "@/schemas/client.schema";
import ControlledRadioGroup from "@/common/components/ControlledRadioGroup";
import { GENDER_OPTIONS } from "@/consts";
import FilesUploader from "@/common/components/FilesUploader";
import SelectControlled from "@/common/components/SelectControlled";

// YES/NO options for boolean fields
const YES_NO_OPTIONS = [
  { value: "true", label: "Ja" },
  { value: "false", label: "Nee" },
];

// Options for fixed choice fields
const ID_TYPE_OPTIONS = [
  { value: "passport", label: "Paspoort" },
  { value: "id_card", label: "Identiteitskaart" },
  { value: "residence_permit", label: "Verblijfsvergunning" },
];

const LAW_TYPE_OPTIONS = [
  { value: "Youth Act", label: "Jeugdwet" },
  { value: "WLZ", label: "WLZ" },
  { value: "WMO", label: "WMO" },
  { value: "Other", label: "Overig" },
];

const LIVING_SITUATION_OPTIONS = [
  { value: "Home", label: "Thuis" },
  { value: "Foster care", label: "Pleegzorg" },
  { value: "Youth care institution", label: "Jeugdzorginstelling" },
  { value: "Other", label: "Overig" },
];

const REGISTRATION_TYPE_OPTIONS = [
  { value: "Protected Living", label: "Beschermd Wonen" },
  {
    value: "Supervised Independent Living",
    label: "Toezicht zelfstandig wonen",
  },
  { value: "Outpatient Guidance", label: "Dagbegeleiding" },
];

const SIGNED_BY_OPTIONS = [
  { value: "Referrer", label: "Verwijzer" },
  { value: "Parent/Guardian", label: "Ouder/Voogd" },
  { value: "Client", label: "Cliënt" },
];

const IntakeForm = () => {

  const { sendIntakeForm } = useIntake();

  const initialValues: IntakeFormType = {
    addiction_issues: true,
    address: "",
    bsn: "",
    city: "",
    client_signature: true,
    current_school: "",
    date_of_birth: "",
    diagnoses: "",
    email: "",
    first_name: "",
    gender: "",
    guardian_details: [
      {
        address: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
      },
    ],
    guardian_signature: true,
    guidance_goals: "",
    has_valid_indication: true,
    id_number: "",
    id_type: "", // now will use SelectControlled
    indication_end_date: "",
    indication_start_date: "",
    judicial_involvement: true,
    last_name: "",
    law_type: "", // now will use SelectControlled
    living_situation: "", // now will use SelectControlled
    main_provider_contact: "",
    main_provider_name: "",
    medication_details: "",
    mentor_email: "",
    mentor_name: "",
    mentor_phone: "",
    nationality: "",
    other_law_specification: "",
    other_living_situation: "",
    other_risks: "",
    parental_authority: true,
    phone_number: "",
    postal_code: "",
    previous_care: "",
    referrer_email: "",
    referrer_function: "",
    referrer_name: "",
    referrer_organization: "",
    referrer_phone: "",
    referrer_signature: true,
    registration_reason: "",
    registration_type: "", // now will use SelectControlled
    risk_aggression: true,
    risk_drug_dealing: true,
    risk_running_away: true,
    risk_self_harm: true,
    risk_suicidality: true,
    risk_weapon_possession: true,
    sharing_permission: true,
    signature_date: "",
    signed_by: "", // now will use SelectControlled
    truth_declaration: true,
    uses_medication: true,
    attachement_ids: undefined,
  };

  const methods = useForm<IntakeFormType>({
    resolver: yupResolver(IntakeFormSchema) as Resolver<IntakeFormType>,
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = methods;

  const adresses = watch("signed_by");

  const onSubmit = async (data: IntakeFormType) => {
    try {
      console.log(data);
      await sendIntakeForm({
        ...data,
        date_of_birth: data.date_of_birth
          ? dayjs(data.date_of_birth).toISOString()
          : "",
        signature_date: data.signature_date
          ? dayjs(data.signature_date).toISOString()
          : "",
        indication_end_date: data.indication_end_date
          ? dayjs(data.indication_end_date).toISOString()
          : "",
        indication_start_date: data.indication_start_date
          ? dayjs(data.indication_start_date).toISOString()
          : "",
      });
      reset(initialValues);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 py-4"
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Personal Information Panel */}
          <div className="w-full sm:w-1/2">
            <Panel
              title="Persoonlijke Informatie"
              containerClassName="px-7 py-4"
            >
              <InputControl
                name="first_name"
                className="w-full mb-4.5"
                required
                label="Voornaam"
                type="text"
                placeholder="Voornaam"
              />
              <InputControl
                name="last_name"
                className="w-full mb-4.5"
                required
                label="Achternaam"
                type="text"
                placeholder="Achternaam"
              />
              <InputControl
                name="date_of_birth"
                className="w-full mb-4.5"
                required
                label="Geboortedatum"
                type="date"
              />
              <ControlledRadioGroup
                name="gender"
                className="w-full mb-4.5"
                options={GENDER_OPTIONS}
                label="Geslacht"
              />
              <InputControl
                name="address"
                className="w-full mb-4.5"
                required
                label="Adres"
                type="text"
                placeholder="Adres"
              />
              <InputControl
                name="city"
                className="w-full mb-4.5"
                required
                label="Stad"
                type="text"
                placeholder="Stad"
              />
              <InputControl
                name="postal_code"
                className="w-full mb-4.5"
                required
                label="Postcode"
                type="text"
                placeholder="Postcode"
              />
              <InputControl
                name="phone_number"
                className="w-full mb-4.5"
                required
                label="Telefoonnummer"
                type="tel"
                placeholder="Telefoonnummer"
              />
              <InputControl
                name="email"
                className="w-full mb-4.5"
                required
                label="E-mailadres"
                type="email"
                placeholder="E-mailadres"
              />
              <InputControl
                name="bsn"
                className="w-full mb-4.5"
                label="BSN"
                type="text"
                placeholder="BSN"
              />
            </Panel>
          </div>

          {/* Additional Details Panel */}
          <div className="w-full sm:w-1/2">
            <Panel title="Aanvullende Gegevens" containerClassName="px-7 py-4">
              <InputControl
                name="current_school"
                className="w-full mb-4.5"
                label="Huidige School"
                type="text"
                placeholder="Huidige School"
              />
              <InputControl
                name="diagnoses"
                className="w-full mb-4.5"
                label="Diagnoses"
                type="text"
                placeholder="Diagnoses"
              />
              <InputControl
                name="guidance_goals"
                className="w-full mb-4.5"
                label="Begeleidingsdoelen"
                type="text"
                placeholder="Begeleidingsdoelen"
              />
              <InputControl
                name="id_number"
                className="w-full mb-4.5"
                label="Identificatienummer"
                type="text"
                placeholder="Identificatienummer"
              />
              <SelectControlled
                label="ID Type"
                id="id_type"
                name="id_type"
                options={ID_TYPE_OPTIONS}
                className="w-full mb-4.5"
                required={true}
              />
              <InputControl
                name="indication_start_date"
                className="w-full mb-4.5"
                label="Indicatie Startdatum"
                type="date"
              />
              <InputControl
                name="indication_end_date"
                className="w-full mb-4.5"
                label="Indicatie Einddatum"
                type="date"
              />
              <SelectControlled
                label="Rechtstype"
                id="law_type"
                name="law_type"
                options={LAW_TYPE_OPTIONS}
                className="w-full mb-4.5"
                required={true}
              />
              <SelectControlled
                label="Woonsituatie"
                id="living_situation"
                name="living_situation"
                options={LIVING_SITUATION_OPTIONS}
                className="w-full mb-4.5"
                required={true}
              />
              <InputControl
                name="registration_reason"
                className="w-full mb-4.5"
                label="Registratie Reden"
                type="text"
                placeholder="Registratie Reden"
              />
              <SelectControlled
                label="Registratie Type"
                id="registration_type"
                name="registration_type"
                options={REGISTRATION_TYPE_OPTIONS}
                className="w-full mb-4.5"
                required={true}
              />
              <FilesUploader
                label="Identiteitsdocumenten"
                name="attachement_ids"
                trigger={adresses}
                intakeForm={true}
              />
            </Panel>
          </div>

          {/* Provider & Verwijzer Details Panel */}
          <div className="w-full sm:w-1/2">
            <Panel title="Leverancier & Verwijzer" containerClassName="px-7 py-4">
              <InputControl
                name="main_provider_contact"
                className="w-full mb-4.5"
                label="Hoofdleverancier Contact"
                type="text"
                placeholder="Hoofdleverancier Contact"
              />
              <InputControl
                name="main_provider_name"
                className="w-full mb-4.5"
                label="Hoofdleverancier Naam"
                type="text"
                placeholder="Hoofdleverancier Naam"
              />
              <InputControl
                name="medication_details"
                className="w-full mb-4.5"
                label="Medicatiegegevens"
                type="text"
                placeholder="Medicatiegegevens"
              />
              <InputControl
                name="mentor_email"
                className="w-full mb-4.5"
                label="Mentor E-mailadres"
                type="email"
                placeholder="Mentor E-mailadres"
              />
              <InputControl
                name="mentor_name"
                className="w-full mb-4.5"
                label="Mentor Naam"
                type="text"
                placeholder="Mentor Naam"
              />
              <InputControl
                name="mentor_phone"
                className="w-full mb-4.5"
                label="Mentor Telefoonnummer"
                type="tel"
                placeholder="Mentor Telefoonnummer"
              />
              <InputControl
                name="nationality"
                className="w-full mb-4.5"
                label="Nationaliteit"
                type="text"
                placeholder="Nationaliteit"
              />
              <InputControl
                name="other_law_specification"
                className="w-full mb-4.5"
                label="Overige Rechtspecificatie"
                type="text"
                placeholder="Overige Rechtspecificatie"
              />
              <InputControl
                name="other_living_situation"
                className="w-full mb-4.5"
                label="Overige Woonsituatie"
                type="text"
                placeholder="Overige Woonsituatie"
              />
              <InputControl
                name="other_risks"
                className="w-full mb-4.5"
                label="Overige Risico's"
                type="text"
                placeholder="Overige Risico's"
              />
              <InputControl
                name="previous_care"
                className="w-full mb-4.5"
                label="Eerdere Zorg"
                type="text"
                placeholder="Eerdere Zorg"
              />
              <InputControl
                name="referrer_email"
                className="w-full mb-4.5"
                label="Verwijzer E-mailadres"
                type="email"
                placeholder="Verwijzer E-mailadres"
              />
              <InputControl
                name="referrer_function"
                className="w-full mb-4.5"
                label="Functie Verwijzer"
                type="text"
                placeholder="Functie Verwijzer"
              />
              <InputControl
                name="referrer_name"
                className="w-full mb-4.5"
                label="Naam Verwijzer"
                type="text"
                placeholder="Naam Verwijzer"
              />
              <InputControl
                name="referrer_organization"
                className="w-full mb-4.5"
                label="Organisatie Verwijzer"
                type="text"
                placeholder="Organisatie Verwijzer"
              />
              <InputControl
                name="referrer_phone"
                className="w-full mb-4.5"
                label="Telefoonnummer Verwijzer"
                type="tel"
                placeholder="Telefoonnummer Verwijzer"
              />
            </Panel>
          </div>

          {/* Guardian Details Panel */}
          <div className="w-full sm:w-1/2">
            <Panel title="Gegevens Voogd" containerClassName="px-7 py-4">
              <InputControl
                name="guardian_details[0].first_name"
                className="w-full mb-4.5"
                required
                label="Voornaam Voogd"
                type="text"
                placeholder="Voornaam Voogd"
              />
              <InputControl
                name="guardian_details[0].last_name"
                className="w-full mb-4.5"
                required
                label="Achternaam Voogd"
                type="text"
                placeholder="Achternaam Voogd"
              />
              <InputControl
                name="guardian_details[0].address"
                className="w-full mb-4.5"
                required
                label="Adres Voogd"
                type="text"
                placeholder="Adres Voogd"
              />
              <InputControl
                name="guardian_details[0].email"
                className="w-full mb-4.5"
                required
                label="E-mailadres Voogd"
                type="email"
                placeholder="E-mailadres Voogd"
              />
              <InputControl
                name="guardian_details[0].phone_number"
                className="w-full mb-4.5"
                required
                label="Telefoonnummer Voogd"
                type="tel"
                placeholder="Telefoonnummer Voogd"
              />
              <ControlledRadioGroup
                name="guardian_signature"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Voogd Handtekening"
              />
            </Panel>
          </div>

          {/* Signatures & Juridisch Panel */}
          <div className="w-full sm:w-1/2">
            <Panel title="Handtekeningen & Juridisch" containerClassName="px-7 py-4">
              <ControlledRadioGroup
                name="addiction_issues"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Verslavingsproblemen"
              />
              <ControlledRadioGroup
                name="client_signature"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Cliënthandtekening"
              />
              <ControlledRadioGroup
                name="judicial_involvement"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Juridische Betrokkenheid"
              />
              <ControlledRadioGroup
                name="has_valid_indication"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Geldige Indicatie"
              />
              <ControlledRadioGroup
                name="parental_authority"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Ouderlijke Macht"
              />
              <ControlledRadioGroup
                name="referrer_signature"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Verwijzer Handtekening"
              />
              <ControlledRadioGroup
                name="risk_aggression"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Risico op Agressie"
              />
              <ControlledRadioGroup
                name="risk_drug_dealing"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Risico op Drugshandel"
              />
              <ControlledRadioGroup
                name="risk_running_away"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Risico op Weglopen"
              />
              <ControlledRadioGroup
                name="risk_self_harm"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Risico op Zelfbeschadiging"
              />
              <ControlledRadioGroup
                name="risk_suicidality"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Risico op Suïcidaliteit"
              />
              <ControlledRadioGroup
                name="risk_weapon_possession"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Risico op Wapenbezit"
              />
              <ControlledRadioGroup
                name="sharing_permission"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Deel Toestemming"
              />
              <ControlledRadioGroup
                name="truth_declaration"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Waarheidsverklaring"
              />
              <ControlledRadioGroup
                name="uses_medication"
                className="w-full mb-4.5"
                options={YES_NO_OPTIONS}
                label="Gebruikt Medicatie"
              />
              <InputControl
                name="signature_date"
                className="w-full mb-4.5"
                label="Datum Ondertekening"
                type="date"
              />
              <SelectControlled
                label="Ondertekend Door"
                id="signed_by"
                name="signed_by"
                options={SIGNED_BY_OPTIONS}
                className="w-full mb-4.5"
                required={true}
              />
            </Panel>
          </div>
        </div>
        <Button
          isLoading={isSubmitting}
          type="submit"
          formNoValidate={true}
          className="max-w-[200px] mx-auto"
        >
          Verzenden
        </Button>
      </form>
    </FormProvider>
  );
};

export default withAuth(IntakeForm, {
  mode: AUTH_MODE.LOGGED_OUT,
  redirectUrl: Routes.Common.Home,
});