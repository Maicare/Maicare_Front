"use client";

import React, { FunctionComponent, useCallback, useEffect } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import GeneralInfos, {
  GeneralInfosInitial,
  GeneralInfosShema,
} from "./incidentsSteps/GeneralInfos";
import IncidentInfos, {
  IncidentInfosInitial,
  IncidentInfosShema,
} from "./incidentsSteps/IncidenetInfos";
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
import { Incident } from "@/types/incident.types";
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
  clientId: number;
  incidentId?: number;
  mode: string;
};

const EpisodeForm: FunctionComponent<Props> = ({
  clientId,
  incidentId,
  mode,
}) => {
  const router = useRouter();
  const initialValues: Incident = {
    ...SuccessionInitital,
    ...AnalysisInitial,
    ...GeneralInfosInitial,
    ...ClientConsequencesInitial,
    ...IncidentInfosInitial,
  };

  // const { incidents: singleIncident, isLoading: isDataLoading } =
  //   useIncident(clientId);

  const { createOne, updateOne, readOne } = useIncident(clientId);
  // const { data: singleIncident, isLoading: isFetching } = readOne(incidentId);
  const singleIncident = null;
  const isDataLoading = false;

  const methods = useForm<Incident>({
    resolver: yupResolver(formSchema),
    defaultValues:
      mode === "edit" && singleIncident
        ? singleIncident
        : { ...initialValues, client_id: clientId },
    mode: "onBlur",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (mode === "edit" && singleIncident) {
      reset(singleIncident);
    }
  }, [mode, singleIncident, reset]);

  const onSubmit = useCallback(
    async (values: Incident) => {
      const formattedValues = {
        ...values,
        incident_date: new Date(values.incident_date).toISOString(),
      };

      if (mode === "edit") {
        await updateOne({
          ...formattedValues,
          id: incidentId,
        });
        router.push(`/clients/${clientId}/incidents`);
      } else if (mode === "new") {
        //incident_date "parsing time \"2025-01-12\" as \"2006-01-02T15:04:05Z07:00\": cannot parse \"\" as \"T\"

        await createOne(formattedValues);
        router.push(`/clients/${clientId}/incidents`);
      }
    },
    [createOne, updateOne, mode, incidentId, clientId, router]
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
