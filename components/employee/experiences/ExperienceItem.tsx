"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Experience } from "@/types/experience.types";
import { cn } from "@/utils/cn"
import { formatDateToDutch } from "@/utils/timeFormatting";
import { ArrowRightCircle, Briefcase, Edit, Trash } from "lucide-react"
import { useState } from "react";

type Props = {
    first?: boolean;
    experience:Experience;
    onEdit:()=>void;
    onDelete:()=>void;
}
const EducationItem = ({ first = false,experience,onDelete,onEdit }: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex justify-between mb-6 hover:bg-slate-100 p-2 rounded-md" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <div className="flex items-start gap-2 relative">
                <ArrowRightCircle size={15} className={cn('absolute -left-10 top-[6px]', first && "arrow-animation text-indigo-400")} />
                <Briefcase size={26} className='text-indigo-400' />
                <div className='flex flex-col'>
                    <p className="text-base text-slate-600 font-bold">{experience.job_title}</p>
                    <p className="text-sm text-slate-400">{experience.company_name}</p>
                    <p className="text-sm text-slate-400">{formatDateToDutch(experience.start_date) + " - " + formatDateToDutch(experience.end_date)}</p>
                    <p className="text-sm text-slate-400  mt-2">{experience.description}</p>
                </div>
            </div>
            <div className={cn("flex flex-col gap-2 transition-all ease-in-out duration-300", visible ? 'opacity-100' : 'opacity-0')}>
                <PrimaryButton
                    text="Bewerken"
                    onClick={onEdit}
                    icon={Edit}
                    animation="animate-bounce"
                    className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-2 py-1 text-sm max-w-[100px]"
                />
                <PrimaryButton
                    text="Verwijderen"
                    onClick={onDelete}
                    icon={Trash}
                    animation="animate-bounce"
                    className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 text-sm max-w-[100px]"
                />
            </div>
        </div>
    )
}

export default EducationItem