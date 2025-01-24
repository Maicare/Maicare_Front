'use client';
import { ModalProps } from "@/common/types/modal.types";
import { Id } from "@/common/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionComponent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import FormModal from "./FormModal";
import { useSnackbar } from "notistack";
import Button from "../Buttons/Button";
import { ControlledRoleSelect } from "@/components/ControlledRoleSelect/ControlledRoleSelect";
import { useParams } from "next/navigation";
import { useRole } from "@/hooks/role/use-role";

const initialValues = {
    role_id: 0,
};
type FormValues = {
    role_id: Id;
}

const validationSchema = yup.object().shape({
    role_id: yup
        .number()
        .required("role is required"),
});

const RoleSelectModal: FunctionComponent<ModalProps> = ({ open, onClose, additionalProps }) => {
    const {employeeId} = useParams();

    const methods = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: additionalProps?.initialData ?? initialValues,
    });
    const {updateOneRole,mutate} = useRole({autoFetch:false});
    const {enqueueSnackbar} = useSnackbar();
    const {
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;
    const onSubmit = async (data: FormValues) => {
        await updateOneRole(Number(employeeId),data.role_id, { displayProgress: true, displaySuccess: true });
        await mutate();
        onClose();
    };

    if (errors && Object.values(errors).length) {
        enqueueSnackbar(Object.values(errors)?.[0]?.message, { variant: "error" });
    }
    if (!employeeId || Array.isArray(employeeId)) {
        console.log("empl null")
        return null;
    }
    return (
        <FormModal
            panelClassName={"min-h-30"}
            open={open}
            onClose={onClose}
            title={"Selecteer een Rollen"}
        >
            <FormProvider {...methods}>
                <form className="flex flex-col grow" onSubmit={handleSubmit(onSubmit)}>
                    <ControlledRoleSelect label="Rollen" name="role_id" className="mb-5" />
                    <Button className="mt-auto" disabled={isSubmitting} type={"submit"} formNoValidate={false}>
                        Selecteer Rollen
                    </Button>
                </form>
            </FormProvider>
        </FormModal>
    );
};

export default RoleSelectModal;
