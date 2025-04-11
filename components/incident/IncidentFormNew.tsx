"use client";

import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import Report from "./incidentsSteps/Report";

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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

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
      if (incident.emails) {
        setSelectedEmails(incident.emails);
      }
    }
  }, [mode, incident, reset]);

  const onSubmit = useCallback(
    async (values: CreateIncident) => {
      const formattedValues = {
        ...values,
        incident_date: new Date(values.incident_date).toISOString(),
        emails: selectedEmails,
      };

      if (mode === "edit" && incident) {
        setIsDataLoading(true);
        // await updateOne({...formattedValues}, incident.id, clientId);
        setIsDataLoading(false);
        router.push(`/clients/${clientId}/incidents`);
      } else if (mode === "new") {
        setIsDataLoading(true);
        alert("commented for now");
        // await createOne({...formattedValues,employee_id: values.employee_id.toString() || "1",location_id:values.location_id.toString()||"1",additional_appointments:values.additional_appointments || "",cause_explanation:values.cause_explanation||"",}, clientId);
        setIsDataLoading(false);
        router.push(`/clients/${clientId}/incidents`);
      }
    },
    [ updateOne, mode, incident, clientId, selectedEmails, router]
  );

  const FORMS = [
    { name: "GeneralInfos", component: GeneralInfos },
    { name: "IncidentInfos", component: IncidentInfos },
    { name: "Analysis", component: Analysis },
    { name: "ClientConsequences", component: ClientConsequences },
    { name: "Succession", component: Succession },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {FORMS.map(({ name, component: Component }) => (
            <Component key={name} />
          ))}
          <Report
            clientId={clientId}
            incident={incident}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
          />
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
