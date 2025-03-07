"use client";

import { Edit, PlusCircle, Trash } from "lucide-react";

const page = () => {
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Certification</h1>
                <button className="flex items-center justify-center gap-2 bg-indigo-400 text-white rounded-md p-2 px-4 text-sm">
                    <span>Add</span>
                    <PlusCircle size={15} className="animate-bounce" />
                </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-sm w-full ">
                    <div className="w-full p-3 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                            <img src="/images/az-900.png" alt="certification" className="h-15 w-15 rounded-full bg-cover" />
                        </div>
                        <h1 className="text-md font-semibold mt-3">AZ-900</h1>
                        <p className="text-sm text-gray-500">Microsoft Azure Fundamentals</p>
                        <p className="mt-2">12/30/2025</p>
                    </div>
                    <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                        <button className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Edit</span>
                            <Edit size={15} className='animate-bounce' />
                        </button>
                        <button className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md p-1 text-sm w-[50%]'>
                            <span>Delete</span>
                            <Trash size={15} className='animate-bounce' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page