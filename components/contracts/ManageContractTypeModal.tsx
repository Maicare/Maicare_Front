import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
// import { useModal } from "@/components/providers/ModalProvider";
// import ContactModal from "@/components/Modals/ContactModal";
import InfoIcon from "@/components/icons/InfoIcon";
import { Contact, OpClientTypeRecord } from "@/types/contacts.types";
import DetailCell from "../common/DetailCell";
import { Client } from "@/types/client.types";
import { ModalProps } from "@/common/types/modal-props.types";
import { ContractTypeCreateReqDto, ContractTypeItem } from "@/types/contracts.types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import FormModal from "../common/Modals/FormModal";
import InputControl from "@/common/components/InputControl";
import Button from "../common/Buttons/Button";
import Loader from "../common/loader";
import IconButton from "../common/Buttons/IconButton";
import TrashIcon from "../icons/TrashIcon";
import { useContract } from "@/hooks/contract/use-contract";
import { set } from "nprogress";
// import Button from "../common/Buttons/Button";

const ManageContractTypeModal: FunctionComponent<ModalProps> = ({ additionalProps, ...props }) => {

    const { readContractTypes } = useContract({});

    const [contractTypes, setContractTypes] = useState<ContractTypeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const getContractTypes = useCallback(async () => {
        setIsLoading(true);
        const data = await readContractTypes();
        setContractTypes(
            data.map((contractType) => ({
                label: contractType.name,
                value: contractType.id,
            }))
        );
        setIsLoading(false);
    }, []);

    useEffect(() => {
        getContractTypes();
    }, []);

    const methods = useForm<ContractTypeCreateReqDto>({
        resolver: yupResolver(Yup.object().shape({
            name: Yup.string().required("Geef alstublieft de naam op"),
        })) as Resolver<ContractTypeCreateReqDto>,
        defaultValues: {
            name: "",
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    const onSubmit = async (data: ContractTypeCreateReqDto) => {
        try {
            await additionalProps?.addContractTypes(data.name);
            reset();
            getContractTypes();
        } catch (error) {
            console.log(error);
        }
    };

    const onDelete = async (id: string) => {
        try {
            await additionalProps?.deleteContractTypes(id);
            getContractTypes();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <FormModal {...props} title={"Beheer Contracttypen"}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="border-b border-stroke pb-6 mb-6">
                    <InputControl
                        label={"Naam"}
                        type="text"
                        name={"name"}
                        className={"mb-6"}
                        placeholder={"Voer Naam in"}
                        required={true}
                    />
                    <Button
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        type={"submit"}
                        formNoValidate={true}
                    >
                        Toevoegen
                    </Button>
                </form>
            </FormProvider>
            {isLoading && <Loader />}
            {!isLoading && contractTypes?.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold mb-4">Contracttypen</h3>
                    <div className="flex flex-col gap-2">
                        {contractTypes?.map((contractType: ContractTypeItem) => (
                            <div key={contractType.value} className="flex justify-between items-center border p-4 rounded-lg bg-white border-stroke py-3">
                                <p>{contractType.label}</p>
                                <div className="flex gap-2">
                                    <IconButton
                                        onClick={() => {
                                            onDelete(contractType.value + "");
                                        }
                                        }
                                        buttonType={"Danger"}
                                    // isLoading={isLoading}
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {contractTypes?.length === 0 && (
                <p className="text-sm text-gray-2 dark:text-gray-4">Geen contracttypen gevonden</p>
            )}
        </FormModal>
    );
};

export default ManageContractTypeModal;
