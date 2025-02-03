"use client";

import React, { FunctionComponent, useCallback, useEffect } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import GeneralInfos, {
  GeneralInfosInitial,
  GeneralInfosShema,
} from "./incidentsSteps/GeneralInfos";
import IncidentInfos, {
  IncidentInfosInitial,
  IncidentInfosShema,
} from "./incidentsSteps/IncidentInfos";
import Analysis, {
  AnalysisInitial,
  AnalysisShema,
} from "./incidentsSteps/Analysis";
import ClientConsequences, {
  ClientConsequencesInitial,
  ClientConsequencesShema,
} from "./incidentsSteps/ClientConsequences";
import Succession, {
  SuccessionInitital,
  SuccessionShema,
} from "./incidentsSteps/Succession";
import { CreateIncident, Incident } from "@/types/incident.types";
import Button from "../common/Buttons/Button";
import { useIncident } from "@/hooks/incident/use-incident";

const formSchema = Yup.object().shape({
  ...GeneralInfosShema,
  ...IncidentInfosShema,
  ...AnalysisShema,
  ...ClientConsequencesShema,
  ...SuccessionShema,
});

type Props = {
  incident?: Incident;
  clientId: number;
  mode: string;
};

const EpisodeForm: FunctionComponent<Props> = ({
  incident,
  clientId,
  mode,
}) => {
  const router = useRouter();
  const initialValues: CreateIncident = {
    ...SuccessionInitital,
    ...AnalysisInitial,
    ...GeneralInfosInitial,
    ...ClientConsequencesInitial,
    ...IncidentInfosInitial,
  };

  const { createOne, updateOne } = useIncident({
    clientId: clientId,
    autoFetch: false,
  });

  const isDataLoading = false;

  const methods = useForm<CreateIncident>({
    resolver: yupResolver(formSchema),
    defaultValues:
      mode === "edit" && incident
        ? incident
        : { ...initialValues, client_id: clientId },
    mode: "onBlur",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (mode === "edit" && incident) {
      reset(incident);
    }
  }, [mode, incident, reset]);

  const onSubmit = useCallback(
    async (values: CreateIncident) => {
      const formattedValues = {
        ...values,
        incident_date: new Date(values.incident_date).toISOString(),
      };

      if (mode === "edit") {
        await updateOne(formattedValues, Number(incident?.id), clientId);
        router.push(`/clients/${clientId}/incidents`);
      } else if (mode === "new") {
        await createOne(formattedValues, clientId);
        router.push(`/clients/${clientId}/incidents`);
      }
    },
    [createOne, updateOne, mode, incident, clientId, router]
  );

  const FORMS = [
    { name: "GeneralInfos", component: GeneralInfos },
    { name: "IncidentInfos", component: IncidentInfos },
    { name: "Analysis", component: Analysis },
    { name: "ClientConsequences", component: ClientConsequences },
    { name: "Succession", component: Succession },
  ];

  if (mode == "edit" && isDataLoading)
    return <div className="mt-5">Loading...</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {FORMS.map(({ name, component: Component }) => (
            <Component key={name} />
          ))}
        </div>

        <Button
          type={"submit"}
          disabled={isDataLoading}
          isLoading={isDataLoading}
          formNoValidate={true}
          loadingText={mode === "edit" ? "Bijwerken..." : "Toevoegen..."}
        >
          {mode === "edit" ? "Update Incident" : "Create Incident"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default EpisodeForm;
