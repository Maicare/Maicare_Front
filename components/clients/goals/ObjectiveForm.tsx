import InputControl from '@/common/components/InputControl';
import Button from '@/components/common/Buttons/Button';
import TextareaControlled from '@/components/common/FormFields/TextareaControlled';
import { CreateObjectiveSchema } from '@/schemas/goal.schema';
import { CreateObjective } from '@/types/goals.types';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import ObjectiveGeneratedItem from './ObjectiveGeneratedItem';
import { useGoal } from '@/hooks/goal/use-goal';

type Props = {
    assessmentId: string;
    clientId: string;
    goalId: string;
    initialValues: CreateObjective;
    objectives?: CreateObjective[];
    updateObjective: (id: number, updated: CreateObjective) => void;
    deleteObjective: (id: number) => void;
}

const ObjectiveForm = (props: Props) => {
    const { assessmentId, clientId, goalId, initialValues, objectives, deleteObjective, updateObjective } = props;
    const router = useRouter();
    const {createObjective} = useGoal({ autoFetch: false, assessmentId: +assessmentId, clientId: +clientId });
    const [loading, setLoading] = useState(false);
    const methods = useForm<CreateObjective>({
        resolver: yupResolver(CreateObjectiveSchema),
        defaultValues: initialValues,
    });
    const {
        handleSubmit,
        formState: { isSubmitting, isValid },
        reset
    } = methods;
    const onSubmit = async (_data: CreateObjective) => {
        try {
            await createObjective(+goalId!,[_data], { displayProgress: true, displaySuccess: true });
            reset();
            router.push(`/clients/${clientId}/goals/${assessmentId}/objectives/${goalId}`);
        } catch (error) {
            console.error({ error });
        }
    };
    const submitMany = async () => {
        try {
            setLoading(true);
            await createObjective(+goalId!,objectives!, { displayProgress: true, displaySuccess: true });
            router.back();
        } catch (error) {
            console.error({ error });
        } finally {
            setLoading(false);
        }
    }

    if (objectives
        && objectives.length > 0) {
        return (
            <div className="p-6.5 pt-4.5">
                <div className="flex flex-col gap-4.5">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white">Doelstellingen</h3>
                    <div className="grid grid-cols-1 gap-4.5">
                        {objectives.map((objective, index) => (
                            <ObjectiveGeneratedItem key={index} index={index} objective={objective} updateObjective={updateObjective} deleteObjective={deleteObjective} />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between gap-4.5 mt-4">
                    <Button className="bg-c_red" type={"button"} disabled={loading} isLoading={loading} formNoValidate={true} onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type={"button"} disabled={loading} isLoading={loading} formNoValidate={true} onClick={submitMany}>
                        Create
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, () => { })} className="p-6.5 pt-4.5">
                <InputControl
                    className={"w-full mb-4.5"}
                    required={true}
                    id={"due_date"}
                    name="due_date"
                    max={dayjs().format("YYYY-MM-DDTHH:mm")}
                    label={"Datum en tijd"}
                    type={"date"}
                    placeholder={"Voer de titel van de rapporten in"}
                />
                <TextareaControlled
                    label={"Beschrijving"}
                    name={"objective_description"}
                    required={true}
                    className={"w-full mb-4.5"}
                    rows={8}
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

export default ObjectiveForm