"use client";

import { ContractFormType, ContractResDto } from "@/types/contracts.types";
import dayjs from "dayjs";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { FormProps, FormProvider, Resolver, useForm } from "react-hook-form";
import Button from "../common/Buttons/Button";
import { useContact } from "@/hooks/contact/use-contact";
import { useClient } from "@/hooks/client/use-client";
import ContactAssignment from "./ContactAssignment";
import { ControlledSelect } from "@/common/components/ControlledSelect";
import { useContract } from "@/hooks/contract/use-contract";
import InputControl from "@/common/components/InputControl";
import { AGREEMENT_FILES_TAGS, CARE_RATE_OPTIONS_BY_TYPE, CARE_TYPE_OPTIONS, FINANCING_LAW_OPTIONS, FINANCING_OPTION_OPTIONS, HOURS_TERM_OPTIONS } from "@/consts";
import ControlledCheckboxItem from "@/common/components/ControlledCheckboxItem";
import FilesUploader from "@/common/components/FilesUploader";
import InfoIcon from "../icons/InfoIcon";
import { useModal } from "../providers/ModalProvider";
import ManageContractTypeModal from "./ManageContractTypeModal";
import { WhenNotification } from "./WhenNotification";
import FilesUploader2 from "@/common/components/FilesUploader2";
import { useRouter } from "next/navigation";
import { Any } from "@/common/types/types";

function mapToForm(data: ContractResDto): ContractFormType {
  return {
    start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(data.end_date).format("YYYY-MM-DD"),
    care_type: data.care_type,
    price_frequency: data.price_frequency,
    price: data.price + "",
    attachment_ids: data.attachment_ids ? data.attachment_ids?.map((attachment) => attachment + "") : [],
    reminder_period: data.reminder_period + "",
    care_name: data.care_name,
    tax: data.tax === -1 ? "" : data.tax + "",
    type_id: data.type_id + "",
    hours: data.hours + "",
    hours_type: data.hours_type,
    financing_act: data.financing_act,
    financing_option: data.financing_option,
  };
}


const initialValues: ContractFormType = {
  start_date: dayjs().format("YYYY-MM-DD"),
  end_date: dayjs().format("YYYY-MM-DD"),
  care_type: "",
  price_frequency: "",
  price: "",
  attachment_ids: [],
  reminder_period: "",
  tax: "",
  care_name: "",
  type_id: "",
  financing_act: "",
  financing_option: "",
  hours_type: "",
  hours: "",
};


type PropsType = {
  clientId: string;
  contract?: ContractResDto;
} & FormProps<ContractResDto>;

const ContractForm: FunctionComponent<PropsType> = ({ clientId, contract }) => {

  const router = useRouter();

  const { readOne: getClientData } = useClient({});
  const { readOne: getContactData } = useContact();
  const { readContractTypes, addContractTypes, deleteContractTypes, addContract, updateOne } = useContract({});

  const { open } = useModal(ManageContractTypeModal);


  const [clientData, setClientData] = useState<Any>(null);
  const [contact, setContact] = useState<Any>(null);
  const [contractTypes, setContractTypes] = useState<Any>([]);

  useEffect(() => {
    const getClient = async () => {
      const data = await getClientData(parseInt(clientId));
      setClientData(data);
    };
    getClient();
  }, [clientId]);

  useEffect(() => {
    const getContact = async () => {
      const data = await getContactData(clientData?.sender_id);
      setContact(data);
    };

    if (clientData && clientData.sender_id) {
      getContact();
    }
  }, [clientData]);

  useEffect(() => {
    const getContractTypes = async () => {
      const data = await readContractTypes();
      setContractTypes(
        [
          { label: "Selecteer contracttype", value: "" },
          ...data.map((contractType) => ({
            label: contractType.name,
            value: contractType.id + "",
          }))]
      );
    };
    getContractTypes();
  }, []);

  const parsedInitialValues = useMemo(() => {
    return initialValues;
  }, []);

  const methods = useForm<ContractFormType>({
    // resolver: yupResolver(contractSchema) as Resolver<ContractFormType>,
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset
  } = methods;

  useEffect(() => {
    const getContract = async () => {
      if (contract) {
        const data = mapToForm(contract);
        console.log("Origin", contract)
        console.log("New", data)
        reset(data);
      }
    };
    getContract();
  }, [contract]);

  const onSubmit = async (data: ContractFormType) => {
    try {
      const preparedData = {
        ...data,
        start_date: dayjs(data.start_date).toISOString(),
        end_date: dayjs(data.end_date).toISOString(),
        reminder_period: parseInt(data.reminder_period),
        price: parseInt(data.price),
        tax: parseInt(data.tax),
        hours: data.care_type === "ambulante" ? parseInt(data.hours) : 0,
        type_id: parseInt(data.type_id),
        hours_type: data.hours_type ? data.hours_type : "all_period",
      };
      if (contract) {
        await updateOne({ ...preparedData, sender_id: 32 }, String(contract.id));
        router.push(`/contracts`)
      }
      else {
        await addContract(preparedData, clientId);
        reset();
      }
    } catch (error) {
      console.log(error)
    }

  };

  const careTypeValue = watch("care_type");
  const startDateValue = watch("start_date");
  const endDateValue = watch("end_date");
  const reminderPeriodValue = watch("reminder_period");

  const handleAddType = async (name: string) => {
    try {
      await addContractTypes(name);
      const data = await readContractTypes();
      setContractTypes(data.map((contractType) => ({
        label: contractType.name,
        value: contractType.id + "",
      })));
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteType = async (id: string) => {
    try {
      await deleteContractTypes(id);
      const data = await readContractTypes();
      setContractTypes(data.map((contractType) => ({
        label: contractType.name,
        value: contractType.id + "",
      })));
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 grid-cols-1 lg:grid-cols-2">
        <div>
          <ContactAssignment
            clientId={clientId}
            data={contact}
            unassigned={clientData && !clientData.sender}
          />
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <ControlledSelect
              label={"Contract Type"}
              className={"w-full xl:w-1/2"}
              required={true}
              name={"type_id"}
              id={"type"}
              options={contractTypes}
            />
            <InputControl
              label={"Contractnaam"}
              className={"w-full xl:w-1/2"}
              placeholder={"Voer Contractnaam in"}
              required={true}
              type="text"
              name={"care_name"}
            />
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="xl:w-1/2">
              <button
                type={"button"}
                onClick={() => {
                  open({ contractTypes, addContractTypes: handleAddType, deleteContractTypes: handleDeleteType });
                }}
                className="flex w-full flex-col gap-2 px-4 py-3 info-box"
              >
                <p>
                  <InfoIcon className="inline-block relative -top-0.5" />{" "}
                  <span>
                    Beheer contracttypen? <div className="inline-block text-primary">Klik hier!</div>
                  </span>
                </p>
              </button>
            </div>
            <InputControl
              label={"Herinneringsperiode"}
              placeholder={"Dagen"}
              required={true}
              name={"reminder_period"}
              type={"number"}
              min={0}
              className="w-full xl:w-1/2"
              unit={"dagen"}
            />
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <InputControl
              label={"Startdatum"}
              required={true}
              name={"start_date"}
              min={dayjs().format("YYYY-MM-DD")}
              type={"date"}
              className="w-full xl:w-1/2"
            />
            <InputControl
              label={"Einddatum"}
              required={true}
              name={"end_date"}
              min={startDateValue}
              type={"date"}
              className="w-full xl:w-1/2"
            />
          </div>
          <ControlledSelect
            className={"w-full mb-4.5"}
            name={"care_type"}
            required={true}
            options={CARE_TYPE_OPTIONS}
            label={"Soort Hulpverlening"}
          />
          <div className="mb-6 flex flex-col gap-6 xl:flex-row">
            <ControlledSelect
              label={"Eenheid"}
              required={true}
              name={"price_frequency"}
              disabled={!careTypeValue}
              className="w-full xl:w-1/2"
              options={
                CARE_RATE_OPTIONS_BY_TYPE[careTypeValue as keyof typeof CARE_RATE_OPTIONS_BY_TYPE] ?? [
                  {
                    label: "Selecteer Tarieftype",
                    value: "",
                  },
                ]
              }
            />
            <InputControl
              className={"w-full xl:w-1/2"}
              name={"price"}
              required={true}
              type={"number"}
              min={0}
              step="0.01"
              label={"Tarief"}
              isPrice={true}
              placeholder={"Voer Tarief in"}
            />
          </div>
          <div className="mb-6 flex flex-col gap-6 xl:flex-row">
            <InputControl
              name={"tax"}
              id={"tax"}
              type={"number"}
              min={0}
              step="0.1"
              label={"BTW percentage"}
              unit={"%"}
              placeholder={"Voer BTW percentage in"}
              className="w-full xl:w-1/2"
            />
          </div>
          <div className="mb-6 flex flex-col gap-6 xl:flex-row">
            <ControlledSelect
              className="w-full xl:w-1/2"
              name={"financing_act"}
              required={true}
              options={FINANCING_LAW_OPTIONS}
              label={"Financieringswet"}
            />
            <ControlledSelect
              className="w-full xl:w-1/2"
              name={"financing_option"}
              required={true}
              options={FINANCING_OPTION_OPTIONS}
              label={"Financieringsoptie"}
            />
          </div>
          {careTypeValue === "ambulante" && (
            <div className="mb-6 flex flex-col gap-6 xl:flex-row">
              <ControlledSelect
                className="w-full xl:w-1/2"
                name={"hours_type"}
                options={HOURS_TERM_OPTIONS}
                label={"Uren Term"}
              />
              <InputControl
                className="w-full xl:w-1/2"
                name={"hours"}
                type={"number"}
                min={0}
                label={"Uren"}
                placeholder={"Voer Uren in"}
                unit={"uur"}
              />
            </div>
          )}
        </div>
        <div>

          <WhenNotification startDate={startDateValue} endDate={endDateValue} reminderPeriod={reminderPeriodValue} />

          <FilesUploader2
            label={"Bestanden"}
            name={"attachment_ids"}
            tagOptions={AGREEMENT_FILES_TAGS}
            tagLabel={"Bijlagelabel:"}
          />
        </div>

        <Button
          type={"submit"}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          formNoValidate={true}
          loadingText={"Submitting Contract..."}
        >
          {true ? "Contract Indienen" : "Contract Bijwerken"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ContractForm;
