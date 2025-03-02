import InputControl from "@/common/components/InputControl";
import SelectControlled from "@/common/components/SelectControlled";
import Button from "@/components/common/Buttons/Button";
import TextareaControlled from "@/components/common/FormFields/TextareaControlled";
import { useGoal } from "@/hooks/goal/use-goal";
import { CreateGoalSchema } from "@/schemas/goal.schema";
import { CreateGoal, GOAL_STATUSES } from "@/types/goals.types";
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
    assessmentId: string;
    clientId: string;
}
const initialValues: CreateGoal = {
    description: "",
    start_date: "",
    status: GOAL_STATUSES[0].value,
    target_date: "",
    target_level: "1",
};
const AssessmentGoalForm = (props: Props) => {
    const { assessmentId, clientId } = props;
    const router = useRouter();
    const {createOne} = useGoal({autoFetch:false,assessmentId:+assessmentId,clientId:+clientId});
    const methods = useForm<CreateGoal>({
        resolver: yupResolver(CreateGoalSchema),
        defaultValues: initialValues,
    });
    const {
        handleSubmit,
        formState: { isSubmitting, isValid, },
        reset
    } = methods;
    const onSubmit = async (_data: CreateGoal) => {
        try {
            await createOne(_data, { displayProgress: true, displaySuccess: true });
            reset();
            router.push(`/clients/${clientId}/goals`);
        } catch (error) {
            console.error({ error });
        }
    };


    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, () => { })} className="p-6.5 pt-4.5">
                <div className="flex gap-4 mt-4">
                    <SelectControlled
                        label={"Level"}
                        name={"target_level"}
                        required={true}
                        options={LEVEL_OPTIONS}
                        className={"w-full mb-4.5"}
                    />
                    <SelectControlled
                        label={"Status"}
                        name={"status"}
                        required={true}
                        options={GOAL_STATUSES}
                        className={"w-full mb-4.5"}
                    />
                </div>
                <div className="flex gap-4 mt-4">
                    <InputControl
                        className={"w-full mb-4.5"}
                        required={true}
                        id={"start_date"}
                        name="start_date"
                        max={dayjs().format("YYYY-MM-DDTHH:mm")}
                        label={"Datum en tijd"}
                        type={"date"}
                        placeholder={"Voer de titel van de rapporten in"}
                    />
                    <InputControl
                        className={"w-full mb-4.5"}
                        required={true}
                        id={"target_date"}
                        name="target_date"
                        max={dayjs().format("YYYY-MM-DDTHH:mm")}
                        label={"Datum en tijd"}
                        type={"date"}
                        placeholder={"Voer de titel van de rapporten in"}
                    />
                </div>
                <TextareaControlled
                    label={"Beschrijving"}
                    name={"description"}
                    required={true}
                    className={"w-full mb-4.5"}
                />
                <div className="flex justify-between gap-4.5 mt-4">
                    <Button className="bg-c_red" type={"button"} disabled={isSubmitting} isLoading={isSubmitting} formNoValidate={true} onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type={"submit"} disabled={isSubmitting && isValid} isLoading={isSubmitting} formNoValidate={true}>
                        Create
                    </Button>
                </div>

            </form>
        </FormProvider>
    )
}

export default AssessmentGoalForm