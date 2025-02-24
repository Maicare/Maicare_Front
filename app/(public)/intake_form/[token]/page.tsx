"use client";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import Routes from "@/common/routes";
import Panel from "@/components/common/Panel/Panel";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import ControlledRadioGroup from "@/common/components/ControlledRadioGroup";
import { GENDER_OPTIONS } from "@/consts";
import Button from "@/components/common/Buttons/Button";
import { IntakeFormType } from "@/types/intake.types";
import { useParams } from "next/navigation";
import { useIntake } from "@/hooks/intake/use-intake";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { IntakeFormSchema } from "@/schemas/client.schema";

const IntakeForm = () => {

  const params = useParams();
  const token = params?.token?.toString();

  const { sendIntakeForm } = useIntake(token || "holder")

  const initialValues: IntakeFormType = {
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phonenumber: "",
    gender: "",
    place_of_birth: "",
    representative_first_name: "",
    representative_last_name: "",
    representative_email: "",
    representative_address: "",
    representative_phone_number: "",
    representative_relationship: "",
  }

  const methods = useForm<IntakeFormType>({
    resolver: yupResolver(IntakeFormSchema) as unknown as Resolver<IntakeFormType>,
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = methods;

  const onSubmit = async (data: IntakeFormType) => {
    console.log(data, token)
    try {
      await sendIntakeForm({ ...data, date_of_birth: dayjs(data.date_of_birth).toISOString() })
      reset(initialValues)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <Panel
            title={"klantinformatie"}
            containerClassName="px-7 py-4 flex-1 min-w-[300px]"
          >
            <div className="flex gap-4">
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
            </div>
            <InputControl
              name="date_of_birth"
              className="w-full mb-4.5"
              required
              label="Geboortedatum"
              type="date"
            />
            <InputControl
              name="phonenumber"
              className="w-full mb-4.5"
              required
              label="Telefoonnummer"
              type="tel"
              placeholder="Telefoonnummer"
            />
            <ControlledRadioGroup
              name="gender"
              className="w-full mb-4.5"
              options={GENDER_OPTIONS}
              label="Geslacht"
            />
            <InputControl
              name="place_of_birth"
              className="mb-4 flex-1"
              placeholder="Geboorteplaats"
              required
              label="Geboorteplaats"
              type="text"
            />
          </Panel>
          <Panel
            title={"representatieve informatie"}
            containerClassName="px-7 py-4 flex-1 min-w-[300px]"
          >
            <div className="flex gap-4">
              <InputControl
                name="representative_first_name"
                className="w-full mb-4.5"
                required
                label="Vertegenwoordiger Voornaam"
                type="text"
                placeholder="Voornaam"
              />
              <InputControl
                name="representative_last_name"
                className="w-full mb-4.5"
                required
                label="Representatieve Achternaam"
                type="text"
                placeholder="Achternaam"
              />
            </div>
            <InputControl
              name="representative_email"
              className="w-full mb-4.5"
              required
              label="Vertegenwoordiger E-Mail"
              type="email"
              placeholder="E-Mail"
            />
            <InputControl
              name="representative_address"
              className="w-full mb-4.5"
              required
              label="Vertegenwoordiger Adres"
              type="text"
              placeholder="Adres"
            />
            <InputControl
              name="representative_phone_number"
              className="w-full mb-4.5"
              required
              label="Representatief Telefoonnummer"
              type="tel"
              placeholder="Telefoonnummer"
            />
            <InputControl
              name="representative_relationship"
              className="w-full mb-4.5"
              required
              label="Representatieve Relatie"
              type="text"
              placeholder="Relatie"
            />
          </Panel>
        </div>
        <Button
          isLoading={isSubmitting}
          type={"submit"}
          formNoValidate={true}
          className="max-w-[200px] mx-auto"
        >
          indienen
        </Button>
      </form>
    </FormProvider>
  );
};

export default withAuth(IntakeForm, { mode: AUTH_MODE.LOGGED_OUT, redirectUrl: Routes.Common.Home });

