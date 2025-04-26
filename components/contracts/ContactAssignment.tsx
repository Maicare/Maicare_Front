import React, { FunctionComponent } from "react";
// import { useModal } from "@/components/providers/ModalProvider";
// import ContactModal from "@/components/Modals/ContactModal";
import InfoIcon from "@/components/icons/InfoIcon";
import { Contact, OpClientTypeRecord } from "@/types/contacts.types";
import DetailCell from "../common/DetailCell";
// import Button from "../common/Buttons/Button";

const ContactAssignment: FunctionComponent<{
  data?: Contact;
  clientId: string;
  unassigned: boolean;
  text?: string;
}> = ({ data,  text }) => {
  // const { open } = useModal(ContactModal);
  return (
    <>
      {data && (
        <div className="mb-6 bg-c_gray rounded-md p-4 dark:bg-graydark dark:text-white">
          <h2 className="text-l font-bold mb-4">
            <InfoIcon className="inline-block relative -top-0.5" />{" "}
            {text ?? "Maak een contracten voor de gegeven opdrachtgever"}
          </h2>
          <div className="flex flex-wrap gap-8">
            <DetailCell label={"Soort opdrachtgever"} value={OpClientTypeRecord[data.types]} />
            <DetailCell label={"Naam"} value={data.name} />
            <DetailCell label={"Telefoonnummer"} type={"phone"} value={data.phone_number} />
            <DetailCell
              label={"Contacts"}
              value={
                <>
                  {data.contacts.map((contact) => (
                    <div key={contact.name} className="flex gap-4">
                      <DetailCell label={"Naam"} value={`♦ ${contact.name}`} />
                      <DetailCell
                        label={"Telefoonnummer"}
                        type={"phone"}
                        value={contact.phone_number}
                      />
                      <DetailCell label={"Email"} type={"email"} value={contact.email} />
                    </div>
                  ))}
                </>
              }
            />
          </div>
        </div>
      )}
      {/* {unassigned && (
        <div className="mb-6 flex flex-col p-4  info-box">
          <h2 className="text-l font-bold mb-4">
            <InfoIcon className="inline-block relative -top-0.5" /> Geen opdrachtgever toegewezen
          </h2>
          <p>Deze cliënt heeft geen opdrachtgever toegewezen, wijs er een toe</p>
          <Button
            className={"py-2 gap-2 self-center flex items-center px-6 mt-4"}
            onClick={() => {
              open({ clientId });
            }}
          >
            Voeg opdrachtgever toe
          </Button>
        </div>
      )} */}
    </>
  );
};

export default ContactAssignment;
