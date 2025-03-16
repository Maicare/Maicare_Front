"use client";

import { useRouter } from "next/navigation";
import UpsertEmployeeForm from "../_components/UpsertEmployeeForm";


const Page = () => {
    const router = useRouter();
    const onSuccess = (id:number) => {
        router.push(`/employee/${id}`)
    }
    const onCancel = () => {
        router.back();
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Medewerker Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Medewerker Aanmaken</span></p>
            </div>
            <UpsertEmployeeForm
                mode="create"
                onSuccess={onSuccess}
                onCancel={onCancel}
            />
        </div>
    )
}

export default Page