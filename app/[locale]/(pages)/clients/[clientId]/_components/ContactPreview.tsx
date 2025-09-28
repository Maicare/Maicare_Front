import Button from '@/components/common/Buttons/Button'
import { ArrowRight, PlusCircle, Share2 } from 'lucide-react'
import React from 'react'
import ContactItem from './ContactItem'
import { useEmergencyContact } from '@/hooks/client-network/use-emergency-contact'
import { ContactPreviewLoader } from './ContactPreviewLoader'
import Image from 'next/image'
import PrimaryButton from '@/common/components/PrimaryButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath'

type Props = {
    clientId: string;
    isParentLoading: boolean;
}

const ContactPreview = ({ clientId, isParentLoading }: Props) => {
    const { emergencyContacts, isLoading } = useEmergencyContact({ clientId: clientId })
    const router = useRouter();
      const { currentLocale } = useLocalizedPath();
    
    if (isLoading || isParentLoading) {
        return (
            <ContactPreviewLoader />
        )
    }
    if (emergencyContacts?.results.length === 0) {
        return (
            <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
                <div className="flex justify-between items-center">
                    <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Share2 size={18} className='text-indigo-400' /> Noodcontacten</h1>
                    <Link href={`/clients/${clientId}/client-network/emergency`}>
                        <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                            <span>View All</span>
                            <ArrowRight size={15} className='arrow-animation' />
                        </Button>
                    </Link>
                </div>
                <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4 ">
                    <Image height={200} width={200} src={"/images/no-data.webp"} alt='no data found!' />
                    <PrimaryButton
                        text='Add Contact'
                        animation='animate-bounce'
                        icon={PlusCircle}
                        onClick={()=>router.push(`/${currentLocale}/clients/${clientId}/client-network/emergency`)}
                    />
                </div>
            </div>
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Share2 size={18} className='text-indigo-400' />Noodcontacten</h1>
                <Link href={`/${currentLocale}/clients/${clientId}/client-network/emergency`}>
                    <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                        <span>View All</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </Button>
                </Link>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-4 ">
                {
                    emergencyContacts?.results.map(({ email, first_name, last_name, relationship }, index) => (
                        <ContactItem
                            key={index}
                            email={email}
                            fullName={first_name + " " + last_name}
                            relation={relationship}
                            image='/images/avatar-1.jpg'
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default ContactPreview