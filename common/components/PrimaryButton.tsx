import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';
import React from 'react'

type Props = {
    disabled?:boolean;
    onClick?: ()=>void;
    icon?:LucideIcon;
    text:string;
    className?:string;
    iconSide?:"left"|"right";
    animation?:"animate-bounce"|"arrow-animation";
    type?:"button"|"submit"|"reset";
};

const PrimaryButton = ({disabled=false,text,onClick,icon:Icon,className,iconSide="right",animation="arrow-animation",type="submit"}:Props) => {
    if (!Icon) {
        return (
            <button type={type} disabled={disabled} onClick={onClick} className={cn("flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-md p-2 px-4 text-sm transition-all ease-in-out",className, disabled && "bg-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-500")} >
                <span className="transition-all ease-in-out">{text}</span>
            </button>
        )
    }
    if (iconSide==="left") {
        return (
            <button type={type} disabled={disabled} onClick={onClick} className={cn("flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-md p-2 px-4 text-sm transition-all ease-in-out",className, disabled && "bg-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-500")} >
                {
                    Icon && <Icon size={15} className={cn("transition-all ease-in-out", !disabled && animation)} />
                }
                <span className="transition-all ease-in-out">{text}</span>
            </button>
        )
    }
    return (
        <button type={type} disabled={disabled} onClick={onClick} className={cn("flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-md p-2 px-4 text-sm transition-all ease-in-out",className, disabled && "bg-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-500")} >
            <span className="transition-all ease-in-out">{text}</span>
            {
                Icon && <Icon size={15} className={cn("transition-all ease-in-out", !disabled && animation)} />
            }
        </button>
    )
}

export default PrimaryButton