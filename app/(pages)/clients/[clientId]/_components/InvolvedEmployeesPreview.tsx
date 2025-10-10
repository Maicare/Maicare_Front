import Button from '@/components/common/Buttons/Button'
import { ArrowRight, PlusCircle, Waypoints } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation';
import InvolvedEmployeeItem from './InvolvedEmployeeItem'
import { useInvolvedEmployee } from '@/hooks/client-network/use-involved-employee'
import { ContactPreviewLoader } from './ContactPreviewLoader'

import Image from 'next/image'
import PrimaryButton from '@/common/components/PrimaryButton'
import Link from 'next/link'

type Props = {
    clientId: string;
    isParentLoading: boolean;
}

const InvolvedEmployeesPreview = ({ clientId, isParentLoading }: Props) => {
    const router = useRouter();
    const { involvedEmployees, isLoading } = useInvolvedEmployee({ clientId: clientId })

    if (isLoading || isParentLoading) {
        return (
            <ContactPreviewLoader />
        )
    }
    if (involvedEmployees?.results.length === 0) {
        return (
            <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
                <div className="flex justify-between items-center">
                    <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Waypoints size={18} className='text-indigo-400' />Betrokken medewerkers</h1>
                    <Link href={`/clients/${clientId}/client-network/involved-employees`}>
                        <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                            <span>Alles bekijken</span>
                            <ArrowRight size={15} className='arrow-animation' />
                        </Button>
                    </Link>
                </div>
                <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4 ">
                    <Image height={200} width={200} src={"/images/no-data.webp"} alt='Geen gegevens gevonden!' />
                    <PrimaryButton
                        text="Medewerker toevoegen"
                        animation='animate-bounce'
                        icon={PlusCircle}
                        onClick={()=>router.push(`/clients/${clientId}/client-network/involved-employees`)}

                    />
                </div>
            </div>
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Waypoints size={18} className='text-indigo-400' />Betrokken medewerkers</h1>
                <Link href={`/clients/${clientId}/client-network/involved-employees`}>
                    <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                        <span>Alles bekijken</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </Button>
                </Link>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-4 ">
                {
                    involvedEmployees?.results.map(({ start_date, employee_name, role }, index) => (
                        <InvolvedEmployeeItem
                            key={index}
                            start_date={start_date}
                            fullName={employee_name || ""}
                            relation={role}
                            image='/images/avatar-1.jpg'
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default InvolvedEmployeesPreview