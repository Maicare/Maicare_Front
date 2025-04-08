import Button from '@/components/common/Buttons/Button'
import { ArrowRight, FileBadge } from 'lucide-react'
import React from 'react'
import ReportItem from './ReportItem';
import ReportsPreviewSkeleton from './ReportsPreviewSkeleton';
type Props = {
    isParentLoading: boolean;
}
const ReportsPreview = ({ isParentLoading }: Props) => {
    if (isParentLoading) {
        return(
            <ReportsPreviewSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><FileBadge size={18} className='text-indigo-400' />Rapporten</h1>
                <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                    <span>View All</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </Button>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-4 ">
                <ReportItem
                    image={"/images/avatar-1.jpg"}
                    date='1 okt 23, 15:30'
                    report='Eerste voortgangsrapport: cliënt heeft goede vooruitgang geboekt.'
                    state='😃 Blij'
                    type='Ochtendrapport'
                />
                <ReportItem
                    image={"/images/avatar-1.jpg"}
                    date='1 okt 23, 15:00'
                    report='Eerste voortgangsrapport: cliënt heeft goede vooruitgang geboekt.'
                    state='😊 Gelukkig'
                    type='Avondrapport'
                />
                <ReportItem
                    image={"/images/avatar-1.jpg"}
                    date='1 okt 23, 13:30'
                    report='Eerste voortgangsrapport: cliënt heeft goede vooruitgang geboekt.'
                    state='😞 Depressief'
                    type='Procesrapportage'
                />
            </div>
        </div>
    )
}

export default ReportsPreview