import React, { FunctionComponent } from "react";
import InfoIcon from "@/components/icons/InfoIcon";
// import CreateOpContactModal from "@/components/Modals/CreateOpContactModal";
import { useMutation, useQueryClient } from "react-query";
import { useModal } from "@/components/providers/ModalProvider";
import FormModal from "./FormModal";
import { ModalProps } from "@/common/types/modal-props.types";
import Button from "../Buttons/Button";
import ContactSelector from "@/components/ContactSelector/ContactSelector";


// const patchClientContact = async () => {
//     console.log("PATCH REQUEST REQUIRED.")
// };

// const usePatchClientContact = (clientId: number) => {
//     return useMutation({
//         mutationFn: () => patchClientContact(),
//     });
// };


const ClientContactModal: FunctionComponent<ModalProps> = ({ open, onClose, additionalProps }) => {
    // const { mutate: assign, isLoading } = usePatchClientContact(
    //     additionalProps?.clientId || additionalProps?.client
    // );


    // const { open: openCreateModal } = useModal(CreateOpContactModal);

    return (
        <FormModal
            panelClassName={"min-h-100"}
            open={open}
            onClose={onClose}
            title={"Opdrachtgever Toevoegen"}
        >
            <form className="grow flex flex-col" >
                <ContactSelector name={"selected"} />
                <button
                    onClick={() => {
                        // openCreateModal({});
                    }}
                    className="flex items-baseline gap-1 font-bold mb-10"
                >
                    <InfoIcon className="w-5 h-5 relative bottom-[-0.3rem]" />
                    <div className="text-sm text-gray-400">Wil je een nieuwe opdrachtgever aanmaken?</div>
                </button>
                <Button type="submit" className="mt-auto">
                    Voeg toe
                </Button>
            </form>
        </FormModal>
    );
};

export default ClientContactModal;
