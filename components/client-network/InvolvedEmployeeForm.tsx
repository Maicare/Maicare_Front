import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionComponent, useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import Button from "../common/Buttons/Button";
import InputControl from "@/common/components/InputControl";
import { EMERGENCY_RELATIONSHIP_OPTIONS } from "@/consts";
import SelectControlled from "@/common/components/SelectControlled";
import { ClientInvolvedEmployeeForm } from "@/schemas/client.schema";
import Loader from "../common/loader";
import { InvolvedEmployeeForm as InvolvedEmployeeFormType } from "@/types/involved.types";
import { useInvolvedEmployee } from "@/hooks/client-network/use-involved-employee";
import ControlledEmployeeSelect from "../ControlledEmployeeSelect/ControlledEmployeeSelect";

type PropsType = {
    clientId?: string;
    involvedId?: string;
}

const InvolvedEmployeeForm: FunctionComponent<PropsType> = ({ clientId, involvedId }) => {

    const [loading, setLoading] = useState(true)

    const {  readOne } = useInvolvedEmployee({ clientId })


    const initialValues: InvolvedEmployeeFormType = {
        employee_id: 0,
        role: '',
        start_date: ''
    }

    const methods = useForm<InvolvedEmployeeFormType>({
        resolver: yupResolver(ClientInvolvedEmployeeForm) as Resolver<InvolvedEmployeeFormType>,
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    useEffect(() => {
        if (involvedId) {
            const fetchEmergency = async (id: string) => {
                const data = await readOne(id);
                reset({
                    employee_id: data.employee_id,
                    role: data.role,
                    start_date: data.start_date.split("T")[0]
                })
                setLoading(false)
            }
            fetchEmergency(involvedId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [involvedId]);

    const onSubmit = async (_data: InvolvedEmployeeFormType) => {
        // if (involvedId)
        //     updateOne({ ...data, start_date: new Date(data.start_date).toISOString() }, involvedId)
        // else
        //     createOne({ ...data, start_date: new Date(data.start_date).toISOString() })
    };

    if (involvedId && loading)
        return <Loader />

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6.5">
                <ControlledEmployeeSelect className="mb-6" name="employee_id" required={true} />

                <SelectControlled
                    required={true}
                    label={"Relatie"}
                    name="role"
                    options={EMERGENCY_RELATIONSHIP_OPTIONS}
                />

                <InputControl
                    placeholder="Startdatum"
                    label="Startdatum"
                    required={true}
                    name={"start_date"}
                    type="date"
                    className="w-full mb-4.5"
                />

                <Button
                    type={"submit"}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    formNoValidate={true}
                    loadingText={involvedId ? "Bijwerken..." : "Toevoegen..."}
                >
                    {involvedId ? "Medewerker bijwerken" : "Medewerker indienen"}
                </Button>
            </form>
        </FormProvider>
    )
}

export default InvolvedEmployeeForm;
