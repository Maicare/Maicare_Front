"use client";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import Routes from "@/common/routes";
import Panel from "@/components/common/Panel/Panel";
import { FormProvider, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import Button from "@/components/common/Buttons/Button";
import { RegistrationFormType } from "@/types/registration.types";
import { useRegistration } from "@/hooks/registration/use-registration";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegistrationFormSchema } from "@/schemas/client.schema";
import ControlledRadioGroup from "@/common/components/ControlledRadioGroup";
import SelectControlled from "@/common/components/SelectControlled";
import { CLIENT_GENDER_OPTIONS, EDUCATION_LEVEL_OPTIONS, LIVING_SITUATION_OPTIONS } from "@/consts";
import FilesUploader from "@/common/components/FilesUploader";
import { useSnackbar } from "notistack";

const YES_NO_OPTIONS = [
    { value: "true", label: "Ja" },
    { value: "false", label: "Nee" },
];

export default function RegistrationForm() {
    const { createRegistrationForm } = useRegistration();
    const { enqueueSnackbar } = useSnackbar();

    const initialValues: RegistrationFormType = {
        client_first_name: "",
        client_last_name: "",
        client_bsn_number: "",
        client_gender: "",
        client_nationality: "",
        client_phone_number: "",
        client_email: "",
        client_street: "",
        client_house_number: "",
        client_postal_code: "",
        client_city: "",
        referrer_first_name: "",
        referrer_last_name: "",
        referrer_organization: "",
        referrer_job_title: "",
        referrer_phone_number: "",
        referrer_email: "",
        guardian1_first_name: "",
        guardian1_last_name: "",
        guardian1_relationship: "",
        guardian1_phone_number: "",
        guardian1_email: "",
        guardian2_first_name: "",
        guardian2_last_name: "",
        guardian2_relationship: "",
        guardian2_phone_number: "",
        guardian2_email: "",
        education_institution: null,
        education_mentor_name: null,
        education_mentor_phone: null,
        education_mentor_email: null,
        education_currently_enrolled: false,
        education_additional_notes: null,
        education_level: null,
        work_current_employer: null,
        work_employer_phone: null,
        work_employer_email: null,
        work_current_position: null,
        work_currently_employed: false,
        work_start_date: null,
        work_additional_notes: null,
        care_protected_living: false,
        care_assisted_independent_living: false,
        care_room_training_center: false,
        care_ambulatory_guidance: false,
        risk_aggressive_behavior: false,
        risk_suicidal_selfharm: false,
        risk_substance_abuse: false,
        risk_psychiatric_issues: false,
        risk_criminal_history: false,
        risk_flight_behavior: false,
        risk_weapon_possession: false,
        risk_sexual_behavior: false,
        risk_day_night_rhythm: false,
        risk_other: false,
        risk_other_description: null,
        risk_additional_notes: null,
        document_referral: null,
        document_education_report: null,
        document_psychiatric_report: null,
        document_diagnosis: null,
        document_safety_plan: null,
        document_id_copy: null,
        application_date: dayjs().format("YYYY-MM-DD"),
        referrer_signature: false,
    };

    const methods = useForm<RegistrationFormType>({
        resolver: yupResolver(RegistrationFormSchema) as Resolver<RegistrationFormType>,
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = methods;

    const onSubmit = async (data: RegistrationFormType) => {
        try {
            console.log(data);
            await createRegistrationForm({
                ...data,
                work_start_date: data.work_start_date
                    ? dayjs(data.work_start_date).toISOString()
                    : null,
                application_date: data.application_date
                    ? dayjs(data.application_date).toISOString()
                    : new Date().toISOString(),
            });
            reset(initialValues);
            enqueueSnackbar("Registration submitted successfully!", { variant: "success" });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit, (errors) => console.error("Validation Errors:", errors))}
                className="flex flex-col gap-4 py-4"
            >
                <div className="flex flex-wrap gap-4 justify-center">
                    {/* Client Information Panel */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Cliënt Informatie" containerClassName="px-7 py-4">
                            <InputControl name="client_first_name" className="w-full mb-4.5" required label="Voornaam" type="text" placeholder="Voornaam" />
                            <InputControl name="client_last_name" className="w-full mb-4.5" required label="Achternaam" type="text" placeholder="Achternaam" />
                            <InputControl name="application_date" className="w-full mb-4.5" required label="Aanvraagdatum" type="date" />
                            <InputControl name="client_bsn_number" className="w-full mb-4.5" required label="BSN" type="text" placeholder="BSN" />
                            <SelectControlled label="Geslacht" id="client_gender" name="client_gender" options={CLIENT_GENDER_OPTIONS} className="w-full mb-4.5" required={true} />
                            <InputControl name="client_nationality" className="w-full mb-4.5" required label="Nationaliteit" type="text" placeholder="Nationaliteit" />
                            <InputControl name="client_phone_number" className="w-full mb-4.5" required label="Telefoonnummer" type="tel" placeholder="Telefoonnummer" />
                            <InputControl name="client_email" className="w-full mb-4.5" required label="E-mailadres" type="email" placeholder="E-mailadres" />
                            <InputControl name="client_street" className="w-full mb-4.5" required label="Straat" type="text" placeholder="Straat" />
                            <InputControl name="client_house_number" className="w-full mb-4.5" required label="Huisnummer" type="text" placeholder="Huisnummer" />
                            <InputControl name="client_postal_code" className="w-full mb-4.5" required label="Postcode" type="text" placeholder="Postcode" />
                            <InputControl name="client_city" className="w-full mb-4.5" required label="Stad" type="text" placeholder="Stad" />
                        </Panel>
                    </div>

                    {/* Referrer Information Panel */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Verwijzer Informatie" containerClassName="px-7 py-4">
                            <InputControl name="referrer_first_name" className="w-full mb-4.5" required label="Voornaam Verwijzer" type="text" placeholder="Voornaam Verwijzer" />
                            <InputControl name="referrer_last_name" className="w-full mb-4.5" required label="Achternaam Verwijzer" type="text" placeholder="Achternaam Verwijzer" />
                            <InputControl name="referrer_organization" className="w-full mb-4.5" required label="Organisatie" type="text" placeholder="Organisatie" />
                            <InputControl name="referrer_job_title" className="w-full mb-4.5" required label="Functie" type="text" placeholder="Functie" />
                            <InputControl name="referrer_phone_number" className="w-full mb-4.5" required label="Telefoonnummer" type="tel" placeholder="Telefoonnummer" />
                            <InputControl name="referrer_email" className="w-full mb-4.5" required label="E-mailadres" type="email" placeholder="E-mailadres" />
                            <ControlledRadioGroup name="referrer_signature" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Handtekening Verwijzer" />
                        </Panel>
                    </div>

                    {/* Guardian Information Panel */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Gegevens Voogd / Ouders" containerClassName="px-7 py-4">
                            <h3 className="font-semibold mb-2">Voogd 1</h3>
                            <InputControl name="guardian1_first_name" className="w-full mb-4.5" required label="Voornaam" type="text" placeholder="Voornaam" />
                            <InputControl name="guardian1_last_name" className="w-full mb-4.5" required label="Achternaam" type="text" placeholder="Achternaam" />
                            <InputControl name="guardian1_relationship" className="w-full mb-4.5" required label="Relatie" type="text" placeholder="Relatie" />
                            <InputControl name="guardian1_phone_number" className="w-full mb-4.5" required label="Telefoonnummer" type="tel" placeholder="Telefoonnummer" />
                            <InputControl name="guardian1_email" className="w-full mb-4.5" required label="E-mailadres" type="email" placeholder="E-mailadres" />

                            <h3 className="font-semibold mb-2 mt-4">Voogd 2 (Optioneel)</h3>
                            <InputControl name="guardian2_first_name" className="w-full mb-4.5" label="Voornaam" type="text" placeholder="Voornaam" />
                            <InputControl name="guardian2_last_name" className="w-full mb-4.5" label="Achternaam" type="text" placeholder="Achternaam" />
                            <InputControl name="guardian2_relationship" className="w-full mb-4.5" label="Relatie" type="text" placeholder="Relatie" />
                            <InputControl name="guardian2_phone_number" className="w-full mb-4.5" label="Telefoonnummer" type="tel" placeholder="Telefoonnummer" />
                            <InputControl name="guardian2_email" className="w-full mb-4.5" label="E-mailadres" type="email" placeholder="E-mailadres" />
                        </Panel>
                    </div>

                    {/* Education & Work */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Onderwijs & Werk" containerClassName="px-7 py-4">
                            <h3 className="font-semibold mb-2">Onderwijs</h3>
                            <ControlledRadioGroup name="education_currently_enrolled" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Momenteel ingeschreven?" />
                            <InputControl name="education_institution" className="w-full mb-4.5" label="Onderwijstelling" type="text" placeholder="Onderwijstelling" />
                            <SelectControlled label="Niveau" id="education_level" name="education_level" options={EDUCATION_LEVEL_OPTIONS} className="w-full mb-4.5" required={false} />
                            <InputControl name="education_mentor_name" className="w-full mb-4.5" label="Mentor Naam" type="text" placeholder="Mentor Naam" />
                            <InputControl name="education_mentor_phone" className="w-full mb-4.5" label="Mentor Telefoon" type="tel" placeholder="Mentor Telefoon" />
                            <InputControl name="education_mentor_email" className="w-full mb-4.5" label="Mentor E-mail" type="email" placeholder="Mentor E-mail" />
                            <InputControl name="education_additional_notes" className="w-full mb-4.5" label="Extra notities onderwijs" type="text" placeholder="Extra notities" />

                            <h3 className="font-semibold mb-2 mt-4">Werk</h3>
                            <ControlledRadioGroup name="work_currently_employed" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Momenteel in dienst?" />
                            <InputControl name="work_current_employer" className="w-full mb-4.5" label="Huidige werkgever" type="text" placeholder="Werkgever" />
                            <InputControl name="work_current_position" className="w-full mb-4.5" label="Functie" type="text" placeholder="Functie" />
                            <InputControl name="work_start_date" className="w-full mb-4.5" label="Startdatum" type="date" />
                            <InputControl name="work_employer_phone" className="w-full mb-4.5" label="Telefoon werkgever" type="tel" placeholder="Telefoon" />
                            <InputControl name="work_employer_email" className="w-full mb-4.5" label="E-mail werkgever" type="email" placeholder="E-mail" />
                            <InputControl name="work_additional_notes" className="w-full mb-4.5" label="Extra notities werk" type="text" placeholder="Extra notities" />
                        </Panel>
                    </div>

                    {/* Care Needs */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Zorgbehoeften" containerClassName="px-7 py-4">
                            <ControlledRadioGroup name="care_protected_living" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Beschermd Wonen" />
                            <ControlledRadioGroup name="care_assisted_independent_living" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Begeleid Zelfstandig Wonen" />
                            <ControlledRadioGroup name="care_room_training_center" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Kamer Trainingscentrum" />
                            <ControlledRadioGroup name="care_ambulatory_guidance" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Ambulante Begeleiding" />
                        </Panel>
                    </div>

                    {/* Risks */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Risico's" containerClassName="px-7 py-4">
                            <ControlledRadioGroup name="risk_aggressive_behavior" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Agressief gedrag" />
                            <ControlledRadioGroup name="risk_suicidal_selfharm" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Suïcidaal / Zelfbeschadiging" />
                            <ControlledRadioGroup name="risk_substance_abuse" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Middelenmisbruik" />
                            <ControlledRadioGroup name="risk_psychiatric_issues" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Psychiatrische problemen" />
                            <ControlledRadioGroup name="risk_criminal_history" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Crimineel verleden" />
                            <ControlledRadioGroup name="risk_flight_behavior" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Vluchtgedrag" />
                            <ControlledRadioGroup name="risk_weapon_possession" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Wapenbezit" />
                            <ControlledRadioGroup name="risk_sexual_behavior" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Seksueel grensoverschrijdend gedrag" />
                            <ControlledRadioGroup name="risk_day_night_rhythm" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Verstoord dag/nacht ritme" />
                            <ControlledRadioGroup name="risk_other" className="w-full mb-4.5" options={YES_NO_OPTIONS} label="Overige risico's" />
                            <InputControl name="risk_other_description" className="w-full mb-4.5" label="Beschrijving overige risico's" type="text" placeholder="Beschrijving" />
                            <InputControl name="risk_additional_notes" className="w-full mb-4.5" label="Aanvullende notities risico's" type="text" placeholder="Aanvullende notities" />
                        </Panel>
                    </div>

                    {/* Documents */}
                    <div className="w-full sm:w-1/2">
                        <Panel title="Documenten" containerClassName="px-7 py-4">
                            <FilesUploader label="Verwijsbrief" name="document_referral" trigger={null} intakeForm={true} />
                            <FilesUploader label="Onderwijs / Schoolrapport" name="document_education_report" trigger={null} intakeForm={true} />
                            <FilesUploader label="Psychiatrisch rapport" name="document_psychiatric_report" trigger={null} intakeForm={true} />
                            <FilesUploader label="Diagnose document" name="document_diagnosis" trigger={null} intakeForm={true} />
                            <FilesUploader label="Veiligheidsplan" name="document_safety_plan" trigger={null} intakeForm={true} />
                            <FilesUploader label="Kopie ID" name="document_id_copy" trigger={null} intakeForm={true} />
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

// export default withAuth(RegistrationForm, {
//     mode: AUTH_MODE.LOGGED_OUT,
//     redirectUrl: Routes.Common.Home,
// });
