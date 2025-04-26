"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertDiagnosisForm from "./_components/UpsertDiagnosisForm";

const CreateDiagnosisPage = () => {
    const router = useRouter();
    const { clientId } = useParams();
    const onSuccess = () => {
        router.push(`/test/client/${clientId}/medical-record`)
    }
    const onCancel = () => {
        router.back();
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Nieuwe Diagnose</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Nieuwe Diagnose</span></p>
            </div>
            <UpsertDiagnosisForm
                mode="create"
                onSuccess={onSuccess}
                onCancel={onCancel}
                clientId={clientId as string}
            />
        </div>
    )
}

export default CreateDiagnosisPage