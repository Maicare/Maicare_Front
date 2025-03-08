import { cn } from "@/utils/cn"
import { ArrowRightCircle, Briefcase,  Edit, Trash } from "lucide-react"
import { useState } from "react";

type Props = {
    first?: boolean;
}
const EducationItem = ({first=false}:Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex justify-between mb-6 hover:bg-slate-100 p-2 rounded-md" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <div className="flex items-start gap-2 relative">
                <ArrowRightCircle size={15} className={cn('absolute -left-10 top-[6px]',first && "arrow-animation text-indigo-400")} />
                <Briefcase size={26} className='text-indigo-400' />
                <div className='flex flex-col'>
                    <p className="text-base text-slate-600 font-bold">Senior Front-end Developer</p>
                    <p className="text-sm text-slate-400">Boston Consulting Group</p>
                    <p className="text-sm text-slate-400"> Jan 2019 - Nov 2023</p>
                    <p className="text-sm text-slate-400  mt-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam eligendi doloribus sint rerum tenetur minima, fugiat corporis doloremque eaque. Cupiditate repudiandae laudantium, illum obcaecati nihil, dicta commodi maiores totam numquam quo, eius praesentium quos. Esse dolore impedit, ipsum deserunt nemo natus ad hic modi nostrum ut vel vitae veritatis quidem!</p>
                </div>
            </div>
            <div className={cn("flex flex-col gap-2 transition-all ease-in-out duration-300", visible ? 'opacity-100' : 'opacity-0')}>
                <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md px-2 py-1 text-sm max-w-[100px]'>
                    <span>Edit</span>
                    <Edit size={15} className='animate-bounce' />
                </button>
                <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md px-2 py-1 text-sm max-w-[100px]'>
                    <span>Delete</span>
                    <Trash size={15} className='animate-bounce' />
                </button>
            </div>
        </div>
    )
}

export default EducationItem