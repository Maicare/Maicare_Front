"use client";

import RegistrationForm from "@/app/(public)/registration/_components/registration-form";



const Page = () => {


    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Registraties Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Registraties Aanmaken</span></p>
            </div>
            <RegistrationForm mode="create" registration={undefined} />
        </div>
    )
}

export default Page