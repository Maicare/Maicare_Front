"use client";

import { useRouter } from "next/navigation";
import UpsertClientForm from "../_components/UpsertClientForm";



const Page = () => {
    const router = useRouter();
    const onSuccess = (id:number) => {
        router.push(`/clients/${id}`)
    }
    const onCancel = () => {
        router.back();
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Clienten Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Clienten Aanmaken</span></p>
            </div>
            <UpsertClientForm 
                mode="create"
                onSuccess={onSuccess}
                onCancel={onCancel}
            />
        </div>
    )
}

export default Page