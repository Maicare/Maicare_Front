"use client";

import EducationItem from "@/components/employee/educations/EducationItem";
import {   GraduationCap, PlusCircle } from "lucide-react";

const page = () => {
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <GraduationCap size={24} className='text-indigo-400' />  Education
                </h1>
                <button className="flex items-center justify-center gap-2 bg-indigo-400 text-white rounded-md p-2 px-4 text-sm">
                    <span>Add</span>
                    <PlusCircle size={15} className="animate-bounce" />
                </button>
            </div>
            <div className="w-full bg-white p-4 rounded-md shadow-md">
                <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-6">
                    <EducationItem first={true} />
                    <EducationItem />
                    <EducationItem />
                    <EducationItem />
                </div>
            </div>
        </div>
    )
}

export default page