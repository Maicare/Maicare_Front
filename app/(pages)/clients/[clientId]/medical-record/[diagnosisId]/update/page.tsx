"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertDiagnosisForm from "../../create/_components/UpsertDiagnosisForm";
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { useEffect, useState } from "react";
import { Diagnosis } from "@/types/diagnosis.types";
import { Id } from "@/common/types/types";

const UpdateDiagnosisPage = () => {
    const router = useRouter();
    const { clientId,diagnosisId } = useParams();
    const onSuccess = () => {
        router.push(`/clients/${clientId}/medical-record`)
    }
    const onCancel = () => {
        router.back();
    }
    const { readOne } = useDiagnosis({clientId:parseInt(clientId as string), autoFetch: false });
    const [diagnose, setDiagnose] = useState<Diagnosis | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchDiagnose = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id.toString());
            setDiagnose(data);//TODO: ask taha to add locationId in diagnose details
            setIsLoading(false);
        }
        if (clientId && diagnosisId) fetchDiagnose(+diagnosisId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId,diagnosisId]);
    if (isLoading || !diagnose) {
        return (
            // <UpsertClientFormSkeleton />
            <div className="">loading ...</div>
        )
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Nieuwe Diagnose</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Nieuwe Diagnose</span></p>
            </div>
            <UpsertDiagnosisForm
                mode="update"
                onSuccess={onSuccess}
                onCancel={onCancel}
                clientId={clientId as string}
                diagnosisId={diagnosisId as string}
                diagnosis={{
                    ...diagnose,
                    medications: diagnose.medications.map((medication) => ({
                        ...medication,
                        administered_by_id: medication.administered_by_id.toString(),
                        start_date: new Date(medication.start_date),
                        end_date: new Date(medication.end_date)
                    })),
                }}
            />
        </div>
    )
}

export default UpdateDiagnosisPage