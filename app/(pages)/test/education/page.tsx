"use client";

import EducationItem from "@/components/employee/educations/EducationItem";
import { cn } from "@/utils/cn";
import { CheckCircle, GraduationCap, PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";

const Page = () => {
    const [adding, setAdding] = useState(false);

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <GraduationCap size={24} className='text-indigo-400' />  Education
                </h1>
                <button disabled={adding} className={cn("flex items-center justify-center gap-2 bg-indigo-400 text-white rounded-md p-2 px-4 text-sm", adding && "bg-slate-400")} onClick={() => setAdding(true)}>
                    <span>Add</span>
                    <PlusCircle size={15} className={!adding ? "animate-bounce" : ""} />
                </button>
            </div>
            {adding &&
                <form className="w-full bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-700 font-semibold" htmlFor="degree">Degree</label>
                            <input id="degree" type="text" placeholder="Degree" className="border border-slate-200 rounded-md p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-700 font-semibold" htmlFor="school">School</label>
                            <input id="school" type="text" placeholder="School" className="border border-slate-200 rounded-md p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-700 font-semibold" htmlFor="field">Field</label>
                            <input id="field" type="text" placeholder="Ex: Web Development" className="border border-slate-200 rounded-md p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-700 font-semibold" htmlFor="start-date">Start Date</label>
                            <input id="start-date" type="date" placeholder="Start Date" className="border border-slate-200 rounded-md p-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-700 font-semibold" htmlFor="end-date">End Date</label>
                            <input id="end-date" type="date" placeholder="End Date" className="border border-slate-200 rounded-md p-2" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md px-4 py-3 text-sm'>
                            <span>Save</span>
                            <CheckCircle size={15} className='animate-bounce' />
                        </button>
                        <button type="button" onClick={() => setAdding(false)} className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md px-4 py-3 text-sm'>
                            <span>Cancel</span>
                            <XCircle size={15} className='animate-bounce' />
                        </button>
                    </div>
                </form>
            }
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

export default Page