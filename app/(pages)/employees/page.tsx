"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table"

import { PAGE_SIZE } from "@/consts";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useEmployee } from "@/hooks/employee/use-employee";
import {  EmployeeList, EmployeesSearchParams } from "@/types/employee.types";
import { Row } from "@tanstack/table-core";
import {  ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import TableFilters from "./_components/TableFilters";
import Statistics from "./_components/Statistics";
import { columns } from "./_components/columns";



const EmployeesPage = () => {

  const router = useRouter();

  const [filters, setFilters] = useState<EmployeesSearchParams>({
    page: 1,
    page_size: PAGE_SIZE,
    search: "",
    location_id: undefined, is_archived: undefined, out_of_service: undefined,
  });

  const deboucedFilters = useDebounce(filters, 500);
  const { employees, setPage, page } = useEmployee({...deboucedFilters,autoFetch:true});

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
    router.push(`/test/employee/new`);
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Employees</h1>
        <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Employees</span></p>
      </div>
      <Statistics />
      <TableFilters
        filters={filters}
        handleAdd={handleAdd}
        setFilters={(filter)=>setFilters(filter)}
      />
      <DataTable columns={columns} data={employees?.results ?? []} onRowClick={handleRowClick} className="dark:bg-[#18181b] dark:border-black" />
      <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
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
export default EmployeesPage;