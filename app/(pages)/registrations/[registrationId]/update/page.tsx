"use client";

import RegistrationForm from "@/app/(public)/registration/_components/registration-form";
import { Id } from "@/common/types/types";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import { useRegistration } from "@/hooks/registration/use-registration";
import { Registration } from "@/types/registration.types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RegistrationSkeleton } from "../_components/update-registration-skeleton";



const Page = () => {
    const { registrationId } = useParams();
    const { readOne } = useRegistration({ autoFetch: false });
    const [registration, setRegistration] = useState<Registration | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchRegistration = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id);
            setRegistration(data);
            setIsLoading(false);
        }
        if (registrationId) fetchRegistration(+registrationId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationId]);
    if (isLoading) return <RegistrationSkeleton />;

    if (!registration) return <div className="container mx-auto py-8 space-y-6 "><LargeErrorMessage firstLine="Registratie niet gevonden" secondLine="" /></div>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Registraties Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Registraties Aanmaken</span></p>
            </div>
            <RegistrationForm mode="update" registration={registration} />
        </div>
    )
}

export default Page