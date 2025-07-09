"use client";

import { fullDateFormat } from "@/utils/timeFormatting";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  careTypeDict,
  CONTRACT_STATUS_TRANSLATION_DICT,
  CONTRACT_STATUS_VARIANT_DICT,
} from "@/consts";
import { useModal } from "@/components/providers/ModalProvider";
import {  ContractResDto } from "@/types/contracts.types";
import StatusBadge from "../common/StatusBadge/StatusBadge";
import TerminationModal from "../common/Modals/TerminationModal";
import ContactAssignment from "./ContactAssignment";
import MonthsBetween from "@/common/components/MonthsBetween";
import { WhenNotification } from "./WhenNotification";
import { Loader } from "lucide-react";
import { formatPrice, rateType, calculateTotalRate, getRate } from "@/utils/rate-utils";
import { ClientDetailsResDto } from "@/types/client.types";
import { useContact } from "@/hooks/contact/use-contact";
import { useClient } from "@/hooks/client/use-client";
import { Any } from "@/common/types/types";

type Props = {
  contractData: ContractResDto | null;
  clientId: string;
};

const ContractDetails: FunctionComponent<Props> = ({ contractData, clientId }) => {

  const { readOne: getContactData } = useContact({autoFetch:false});
  const { readOne: getClientData } = useClient({});

  const [contact, setContact] = useState<Any>(null);
  const [contactLoading, setContactLoading] = useState<boolean>(true);
  const [clientData, setClientData] = useState<Any>(null);
  const [isClientLoading, setClientLoading] = useState<boolean>(true);

  useEffect(() => {
    const getContact = async () => {
      try {
        setContactLoading(true);
        const data = await getContactData(contractData?.sender_id || 0);
        setContact(data);
        setContactLoading(false);
      } catch (error) {
        console.log(error)
      }
    };

    if (contractData?.sender_id) {
      getContact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractData]);

  useEffect(() => {
    const getClient = async () => {
      try {
        setClientLoading(true);
        const data = await getClientData(parseInt(clientId));
        setClientData(data);
        setClientLoading(false);
      } catch (error) {
        console.log(error)
      }
    };
    getClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <div
      id="contract"
      className="rounded-sm bg-white p-4 dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9"
    >
      {isClientLoading && contactLoading && <Loader />}
      {clientData && contractData && <ClientData clientData={clientData} contractData={contractData} />}
      <div className="flex flex-col xl:flex-row items-start justify-between mt-5">
        {contact && (
          <ContactAssignment
            clientId={clientId}
            data={contact}
            unassigned={clientData && !clientData.sender_id}
          />
        )}
        {contractData && <WhenNotification endDate={contractData.end_date} startDate={contractData.start_date} reminderPeriod={String(contractData.reminder_period)} />}
      </div>
      {contractData && <ContractData contractData={contractData} />}
      {/* <div className="flex flex-wrap gap-4">
        {contractData?.attachment_ids.map((attachment) => <DownloadFile file={attachment} />)}
      </div> */}
    </div>
  );
};

export default ContractDetails;

function ClientData(props: { clientData: ClientDetailsResDto; contractData: ContractResDto }) {
  // const { mutate: updateContract, isLoading: isUpdating } = useUpdateContract(
  //   props.contractData.id
  // );
  // const { open: openApprove } = useModal(
  //   getConfirmModal({
  //     modalTitle: "Contract goedkeuren",
  //     children: "Weet je zeker dat je dit contract wilt goedkeuren?",
  //   })
  // );

  const { open: _openTerminate } = useModal(TerminationModal);
  return (
    <div className="flex flex-col-reverse gap-5 xl:flex-row xl:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row xl:gap-9">
        <div>
          <p className="mb-1.5 text-lg font-medium text-slate-800  dark:text-white">Cliënt</p>
          <h4 className="mb-4 text-2xl font-semibold text-slate-800  dark:text-white">
            {props.clientData.first_name} {props.clientData.last_name}
          </h4>
          <a href={`mailto:${props.clientData.email}`} className="block">
            <span className="font-medium">Email:</span> {props.clientData.email}
          </a>
          <span className="mt-2 block">
            <span className="font-medium">Locatie:</span> {props.clientData.location}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end w-full max-w-142.5">
        <h3 className="text-2xl mb-10 font-semibold text-slate-800  dark:text-white">
          Contract #{props.contractData.id}
        </h3>
        {/* {props.contractData.status === "draft" && (
          <Button
            onClick={() => {
              openApprove({
                onConfirm: (close: () => void) => {
                  updateContract(
                    {
                      ...resDtoToPatchDto(props.contractData),
                      status: "approved",
                    },
                    {
                      onSuccess: () => {
                        close();
                      },
                    }
                  );
                },
              });
            }}
            buttonType={"Outline"}
          >
            Contract goedkeuren
          </Button>
        )} */}
        {/* {props.contractData.status === "approved" && (
          <Button
            isLoading={false}
            disabled={false}
            buttonType={"Danger"}
            onClick={() => {
              openTerminate({
                title: "Contract beëindigen",
                msg: "Weet je zeker dat je dit contract wilt beëindigen?",
                onSubmit: (terminationEntries: DepartureEntries) => {
                  // updateContract({
                  //   ...resDtoToPatchDto(props.contractData),
                  //   status: "terminated",
                  //   ...terminationEntries,
                  // });
                },
              });
            }}
          >
            Contract beëindigen
          </Button>
        )} */}
        {props.contractData.status === "terminated" && (
          <div className="flex flex-col gap-4 w-full bg-c_gray rounded-lg p-4">
            <div>
              <StatusBadge
                type={CONTRACT_STATUS_VARIANT_DICT[props.contractData.status]}
                text={CONTRACT_STATUS_TRANSLATION_DICT[props.contractData.status]}
              />
            </div>
            <div>
              <p className="text-sm font-bold">Reden van beëindiging:</p>
              <p className="text-slate-800  dark:text-white">
                {props.contractData.departure_reason}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold">Afsluitend rapport:</p>
              <p className="text-slate-800  dark:text-white">
                {props.contractData.departure_report}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContractData(props: { contractData: ContractResDto }) {
  return (
    <div className="my-10 rounded-sm border border-stroke p-5 dark:border-strokedark">
      <div className="items-center sm:flex">
        <div className="w-full items-center justify-between md:flex">
          <div className="mb-3 md:mb-0">
            <span className="inline-block font-medium text-slate-800  hover:text-primary dark:text-white">
              {props.contractData.care_name} ({careTypeDict[props.contractData.care_type]})
            </span>
            <p className="flex text-sm font-medium">
              <span className="mr-5"> Van: {fullDateFormat(props.contractData.start_date)} </span>
              <span className="mr-5"> Tot: {fullDateFormat(props.contractData.end_date)} </span>
              <span className="mr-5">
                {" "}
                Zorgperiode:{" "}
                <MonthsBetween
                  startDate={props.contractData.start_date}
                  endDate={props.contractData.end_date}
                />
              </span>
            </p>
          </div>
          <div className="flex items-center md:justify-end">
            <p className="mr-20 font-semibold text-slate-800  dark:text-white">
              Rate: {rateType(props.contractData)}
            </p>
            <p className="mr-5 font-semibold text-slate-800  dark:text-white">
              {getRate(props.contractData)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentDetails(props: { item: ContractResDto }) {
  return (
    <div className="-mx-4 flex flex-wrap">
      <div className="w-full px-4 sm:w-1/2 xl:w-3/12">
        <div className="mb-10">
          <h4 className="mb-4 text-xl font-semibold text-slate-800  dark:text-white md:text-2xl">
            Total Payed
          </h4>
          <p>{formatPrice(0)}</p>
        </div>
      </div>
      <div className="w-full px-4 sm:w-1/2 xl:w-3/12">
        <div className="mb-10">
          <h4 className="mb-4 text-xl font-semibold text-slate-800  dark:text-white md:text-2xl">
            Left to Pay
          </h4>
          <p>{calculateTotalRate(props.item)}</p>
        </div>
      </div>
      <div className="w-full px-4 xl:w-6/12">
        <div className="mr-10 text-right md:ml-auto">
          <div className="ml-auto sm:w-1/2">
            <p className="mb-4 flex justify-between font-medium text-slate-800  dark:text-white">
              <span> Subtotal </span>
              <span> {calculateTotalRate(props.item)} </span>
            </p>
            <p className="mb-4 flex justify-between font-medium text-slate-800  dark:text-white">
              <span> Insurance (-) </span>
              <span> {formatPrice(0)} </span>
            </p>
            <p className="mb-4 mt-2 flex justify-between border-t border-stroke pt-6 font-medium text-slate-800  dark:border-strokedark dark:text-white">
              <span> Total Payable </span>
              <span> {calculateTotalRate(props.item)} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
