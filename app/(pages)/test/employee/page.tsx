"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import StatisticCard from "@/common/components/StatisticCard";
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
import { PAGE_SIZE } from "@/consts";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useLocation } from "@/hooks/location/use-location";
import { EmployeeList, EmployeesSearchParams } from "@/types/employee.types";
import { Row } from "@tanstack/table-core";
import { Archive, ArrowBigLeft, ArrowBigRight, Outdent, PlusCircle, Users, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Page() {

  const router = useRouter();

  const [filters, setFilters] = useState<EmployeesSearchParams>({
    page: 1,
    page_size: PAGE_SIZE,
    search: "",
    location_id: undefined, is_archived: undefined, out_of_service: undefined
  });

  const deboucedFilters = useDebounce(filters, 500);

  const { employees, setPage, page } = useEmployee(deboucedFilters);
  const {locations} = useLocation();

  const handleRowClick = (employeeRow: Row<EmployeeList>) => {
    const employee = employeeRow.original;
    router.push(`/employees/${employee.id}`);
  };

  const handlePrevious = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page - 1);
  }
  const handleNext = () => {
    if (employees?.next) {
      setPage(page + 1);
      return;
    }
  }
  const handleAdd = () => {
    router.push(`/test/new`);
  }
  return (
    <div className="">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Employees</h1>
        <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Employees</span></p>
      </div>
      <div className="w-full grid lg:grid-cols-[repeat(4,230px)] grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)] justify-between mb-5 ">
        <StatisticCard colorKey="teal" icon={Users} title="Medewerkers" value={800} />
        <StatisticCard colorKey="sky" icon={Outdent} title="Uit Dienst" value={32} />
        <StatisticCard colorKey="pink" icon={Archive} title="Archived" value={45} />
        <StatisticCard colorKey="orange" icon={Workflow} title="Subcontractors" value={94} />
      </div>
      <div className="flex px-2 py-3 bg-white rounded-md mb-5 gap-2 border-2 border-muted">
        <Input type="search" placeholder="Search" className="w-60" value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} />
        <Select value={filters.location_id?.toString()} onValueChange={(e) => setFilters(prev => ({ ...prev, location_id: parseInt(e) }))} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Location" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Locations</SelectLabel>
              {
                locations?.map((item,index)=>(
                  <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 cursor-pointer">{item.name}</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={filters.is_archived ? "true" : "false"} onValueChange={(e) => setFilters(prev => ({ ...prev, is_archived: e === "true" }))} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"Active"} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="true" className="hover:bg-slate-100 cursor-pointer">Archived</SelectItem>
              <SelectItem value="false" className="hover:bg-slate-100 cursor-pointer">Active</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={filters.out_of_service ? "true" : "false"} onValueChange={(e) => setFilters(prev => ({ ...prev, out_of_service: e === "true" }))} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"In service"} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="false" className="hover:bg-slate-100 cursor-pointer">in Service</SelectItem>
              <SelectItem value="true" className="hover:bg-slate-100 cursor-pointer">Out of service</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <PrimaryButton
          text="Add"
          onClick={handleAdd}
          disabled={false}
          icon={PlusCircle}
          animation="animate-bounce"
          className="ml-auto"
        />
      </div>
      <DataTable columns={columns} data={employees?.results ?? []} onRowClick={handleRowClick} />
      <div className="flex px-2 py-3 bg-white rounded-md mt-5 justify-between border-2 border-muted">
        <PrimaryButton
          disabled={page === 1}
          onClick={handlePrevious}
          text={"Previous"}
          icon={ArrowBigLeft}
          iconSide="left"
        />
        <PrimaryButton
          disabled={employees?.next ? false : true}
          onClick={handleNext}
          text={"Next"}
          icon={ArrowBigRight}
        />
      </div>
    </div>
  )
}