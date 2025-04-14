import React, { FunctionComponent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormModal from "./FormModal";
import InputControl from "@/common/components/InputControl";
import ModalActionButton from "../Buttons/ModalActionButton";
import { ModalProps } from "@/common/types/modal.types";
import { useEmployee } from "@/hooks/employee/use-employee";
import { Any } from "@/common/types/types";

type ChangePassFormData = {
    old_password: string;
    new_password: string;
    confirm_password: string;
};

const schema = yup.object().shape({
    old_password: yup.string().required("Oude Wachtwoord is verplicht"),
    new_password: yup
        .string()
        .required("Nieuwe Wachtwoord is verplicht")
        .min(6, "Nieuwe Wachtwoord moet minstens 6 tekens lang zijn"),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password")], "Wachtwoorden komen niet overeen")
        .required("Bevestig Nieuwe Wachtwoord is verplicht"),
});

export const ChangePassModal: FunctionComponent<ModalProps> = (props) => {
    const onUpdated = () => {
        props.onClose();
    };

    return (
        <FormModal {...props} open={true} title="Change Password" >
            <ChangePassModalForm onUpdated={onUpdated} />
        </FormModal>
    );
};

type ChangePassModalFormProps = {
    onUpdated: () => void;
};

const ChangePassModalForm: FunctionComponent<ChangePassModalFormProps> = ({ onUpdated }) => {

    const { updateEmployeePassword } = useEmployee({})


    const methods = useForm<ChangePassFormData>({
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
        resolver: yupResolver(schema),
    });
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (data: ChangePassFormData) => {
        try {
            await updateEmployeePassword(data.new_password, data.old_password);
            onUpdated();
        } catch (error: Any) {
            console.log(error);
        }

    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center w-full space-y-4"
            >
                <div className="w-full">
                    <InputControl
                        label="Oude Wachtwoord"
                        type="password"
                        placeholder="Oude Wachtwoord"
                        className="w-full"
                        name="old_password"
                    />
                    {errors.old_password && (
                        <p className="mt-1 text-xs text-red-600">{errors.old_password.message}</p>
                    )}
                </div>
                <div className="w-full">
                    <InputControl
                        label="Nieuwe Wachtwoord"
                        type="password"
                        placeholder="Nieuwe Wachtwoord"
                        className="w-full"
                        name="new_password"
                    />
                    {errors.new_password && (
                        <p className="mt-1 text-xs text-red-600">{errors.new_password.message}</p>
                    )}
                </div>
                <div className="w-full">
                    <InputControl
                        label="Bevestig Nieuwe Wachtwoord"
                        type="password"
                        placeholder="Bevestig Nieuwe Wachtwoord"
                        className="w-full"
                        name="confirm_password"
                    />
                    {errors.confirm_password && (
                        <p className="mt-1 text-xs text-red-600">{errors.confirm_password.message}</p>
                    )}
                </div>

                <ModalActionButton
                    className="mt-7"
                    actionType="CONFIRM"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Change Password
                </ModalActionButton>
            </form>
        </FormProvider>
    );
};

export default ChangePassModal;