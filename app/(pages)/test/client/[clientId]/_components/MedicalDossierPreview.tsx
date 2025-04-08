import Button from '@/components/common/Buttons/Button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, HeartPulse, Timer } from 'lucide-react'
import React from 'react'
import MedicalDossierPreviewSkeleton from './MedicalDossierPreviewSkeleton';
type Props = {
    isParentLoading: boolean;
}
const MedicalDossierPreview = ({ isParentLoading }: Props) => {
    if (isParentLoading) {
        return(
            <MedicalDossierPreviewSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><HeartPulse size={18} className='text-indigo-400' />Medisch Dossier</h1>
                <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                    <span>View All</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </Button>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-4 ">
                <Accordion type="single" collapsible className="w-full" defaultValue='Diagnose'>
                    <AccordionItem value='Diagnose'>
                        <AccordionTrigger className='text-sm text-slate-600 font-bold'>Diagnose</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>DTLPEIODNK</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Ernstig</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>25 maart 2025</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>DTLPEIODNK</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Ernstig</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>25 maart 2025</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>DTLPEIODNK</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Ernstig</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>25 maart 2025</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='Medicatie'>
                        <AccordionTrigger className='text-sm text-slate-600 font-bold'>Medicatie</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>Dolipran</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Dagelijks</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300 flex gap-1 items-center'><Timer className='w-3 h-3'/> 3 maanden</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>Doligrip</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Wekelijks</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>5 maanden</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>Astrazenical</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Om de twee weken</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>24 maanden</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='Allergieën'>
                        <AccordionTrigger className='text-sm text-slate-600 font-bold'>Allergieën</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>Dolipran</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Dagelijks</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300 flex gap-1 items-center'><Timer className='w-3 h-3'/> 3 maanden</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>Doligrip</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Wekelijks</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>5 maanden</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>Astrazenical</span>
                                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>Om de twee weken</span>
                                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>24 maanden</span>
                                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                                Ea inventore minima Ea inventore minima Ea inventore minima 
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

export default MedicalDossierPreview