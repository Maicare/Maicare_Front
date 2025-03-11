"use client";
import IconButton from "@/components/common/Buttons/IconButton";
import { columns } from "@/components/employee/table/columns"
import { DataTable } from "@/components/employee/table/data-table"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEmployee } from "@/hooks/employee/use-employee";
import { cn } from "@/utils/cn";
import { Archive, ArrowBigLeft, ArrowBigRight,  Outdent, PlusCircle, Users, Workflow } from "lucide-react";



export default function Page() {
  const { employees,setPage,page } = useEmployee({ page: 1, page_size: 10 });
  const handlePrevious = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page-1);
  }
  const handleNext = () => {
    if (employees?.next) {
      setPage(page+1);
      return;
    }
  }
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Employees</h1>
        <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Employees</span></p>
      </div>
      <div className="w-full flex items-center justify-between mb-5 ">
        <div className="px-6 py-3 bg-white rounded-md border-2 border-muted flex items-center justify-between w-[230px]">
          <div className=" flex flex-col gap-4">
            <h1 className='text-base font-semibold'>Medewerkers</h1>
            <p className='text-sm font-medium bg-teal-100 rounded-full text-teal-400 py-2 px-4 w-fit'>800</p>
          </div>
          <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12 bg-teal-400'>
            <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm" />
            <Users />
            <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out" />
          </IconButton>
        </div>
        <div className="px-6 py-3 bg-white rounded-md w-[230px] border-2 border-muted flex items-center justify-between">
          <div className=" flex flex-col gap-4">
            <h1 className='text-base font-semibold'>Uit Dienst</h1>
            <p className='text-sm font-medium bg-sky-100 rounded-full text-sky-400 py-2 px-4 w-fit'>32</p>
          </div>
          <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12 bg-sky-400'>
            <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm" />
            <Outdent />
            <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out" />
          </IconButton>
        </div>
        <div className="px-6 py-3 bg-white rounded-md w-[230px] border-2 border-muted flex items-center justify-between">
          <div className=" flex flex-col gap-4">
            <h1 className='text-base font-semibold'>Archived</h1>
            <p className='text-sm font-medium bg-pink-100 rounded-full text-pink-400 py-2 px-4 w-fit'>40</p>
          </div>
          <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12 bg-pink-400'>
            <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm" />
            <Archive />
            <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out" />
          </IconButton>
        </div>
        <div className="px-6 py-3 bg-white rounded-md w-[230px] border-2 border-muted flex items-center justify-between">
          <div className=" flex flex-col gap-4">
            <h1 className='text-base font-semibold'>Subcontractors</h1>
            <p className='text-sm font-medium bg-orange-100 rounded-full text-orange-400 py-2 px-4 w-fit'>94</p>
          </div>
          <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12 bg-orange-400'>
            <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm" />
            <Workflow />
            <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out" />
          </IconButton>
        </div>
      </div>
      <div className="flex px-2 py-3 bg-white rounded-md mb-5 gap-2 border-2 border-muted">
        <Input type="search" placeholder="Search" className="w-60" />
        <Select  >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Location" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Locations</SelectLabel>
              <SelectItem value="apple" className="hover:bg-slate-100 cursor-pointer">Apple</SelectItem>
              <SelectItem value="banana" className="hover:bg-slate-100 cursor-pointer">Banana</SelectItem>
              <SelectItem value="blueberry" className="hover:bg-slate-100 cursor-pointer">Blueberry</SelectItem>
              <SelectItem value="grapes" className="hover:bg-slate-100 cursor-pointer">Grapes</SelectItem>
              <SelectItem value="pineapple" className="hover:bg-slate-100 cursor-pointer">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select  >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"Active"} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="apple" className="hover:bg-slate-100 cursor-pointer">Archived</SelectItem>
              <SelectItem value="banana" className="hover:bg-slate-100 cursor-pointer">Active</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select  >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"In service"} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="apple" className="hover:bg-slate-100 cursor-pointer">in Service</SelectItem>
              <SelectItem value="banana" className="hover:bg-slate-100 cursor-pointer">Out of service</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <button className={cn("flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-md p-2 px-4 text-sm ml-auto transition-all ease-in-out")} >
          <span className="transition-all ease-in-out">Add</span>
          <PlusCircle size={15} className={"animate-bounce transition-all ease-in-out"} />
        </button>
      </div>
      <DataTable columns={columns} data={employees?.results??[]} onRowClick={(row) => console.log({ row })} />
      <div className="flex px-2 py-3 bg-white rounded-md mt-5 justify-between border-2 border-muted">
        <button disabled={page === 1} onClick={handlePrevious} className={cn("flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-md p-2 px-4 text-sm transition-all ease-in-out",page===1 && "bg-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-500")} >
          <ArrowBigLeft size={15} className={cn("transition-all ease-in-out",page > 1 && "arrow-animation ")} />
          <span className="transition-all ease-in-out">Previous</span>
        </button>
        <button disabled={employees?.next ? false : true} onClick={handleNext} className={cn("flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-md p-2 px-4 text-sm transition-all ease-in-out",employees?.next ? "" : "bg-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-500")} >
          <span className="transition-all ease-in-out">Next</span>
          <ArrowBigRight size={15} className={cn("transition-all ease-in-out",employees?.next ? "arrow-animation" : "")} />
        </button>
      </div>
    </div>
  )
}