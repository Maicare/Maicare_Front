import IconButton from '@/components/common/Buttons/IconButton'
import { cn } from '@/utils/cn';
import { LucideIcon, Outdent } from 'lucide-react'
import React from 'react'

type Props = {
    icon:LucideIcon;
    title:string;
    value:number;
    className?:string;
    colorKey:string;
};

const StatisticCard = ({icon:Icon,title,value,className,colorKey}:Props) => {
    const getClassName = (colorKey:string) => {
        switch (colorKey) {
            case "sky":
                return {
                    p:"bg-sky-100 text-sky-400",
                    button:"bg-sky-400"
                };
            case "pink":
                return {
                    p:"bg-pink-100 text-pink-400",
                    button:"bg-pink-400"
                };
            case "orange":
                return {
                    p:"bg-orange-100 text-orange-400",
                    button:"bg-orange-400"
                };
            case "teal":
                return {
                    p:"bg-teal-100 text-teal-400",
                    button:"bg-teal-400"
                };
        
            default:
                return {
                    p:"bg-teal-100 text-teal-400",
                    button:"bg-teal-400"
                };
        }
    }
    return (
        <div className={cn("lg:px-6 px-3 py-3 bg-white rounded-md border-2 border-muted flex items-center justify-between lg:w-[230px] w-[205px]",className)}>
            <div className=" flex flex-col gap-4">
                <h1 className='text-base font-semibold'>{title}</h1>
                <p className={cn('text-sm font-medium bg-sky-100 rounded-full text-sky-400 py-2 px-4 w-fit',getClassName(colorKey).p)}>{value}</p>
            </div>
            <IconButton className={cn('relative flex items-center justify-center overflow-hidden h-12 w-12 bg-sky-400',getClassName(colorKey).button)}>
                <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm" />
                <Icon />
                <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out" />
            </IconButton>
        </div>
    )
}

export default StatisticCard