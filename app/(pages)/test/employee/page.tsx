"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import StatisticCard from "@/common/components/StatisticCard";
import { columns } from "@/app/(pages)/test/employee/_components/columns"
import { DataTable } from "@/components/employee/table/data-table"

import { PAGE_SIZE } from "@/consts";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useEmployee } from "@/hooks/employee/use-employee";
import { EmployeeCount, EmployeeList, EmployeesSearchParams } from "@/types/employee.types";
import { Row } from "@tanstack/table-core";
import { Archive, ArrowBigLeft, ArrowBigRight, Outdent,  Users, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableFilters from "./_components/TableFilters";



export default function Page() {

  const router = useRouter();

  const [filters, setFilters] = useState<EmployeesSearchParams>({
    page: 1,
    page_size: PAGE_SIZE,
    search: "",
    location_id: undefined, is_archived: undefined, out_of_service: undefined
  });

  const [count, setCount] = useState<EmployeeCount>({
    total_archived: 0,
    total_employees: 0,
    total_out_of_service: 0,
    total_subcontractors: 0
  });

  const deboucedFilters = useDebounce(filters, 500);

  const { employees, setPage, page, readCount } = useEmployee(deboucedFilters);

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

  useEffect(() => {
    const fetchCount = async () => {
      const count = await readCount();
      setCount(count);
    }
    fetchCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Employees</h1>
        <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Employees</span></p>
      </div>
      <div className="w-full grid lg:grid-cols-[repeat(4,230px)] grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)] justify-between mb-5 ">
        <StatisticCard colorKey="teal" icon={Users} title="Medewerkers" value={count.total_employees} />
        <StatisticCard colorKey="sky" icon={Outdent} title="Uit Dienst" value={count.total_out_of_service} />
        <StatisticCard colorKey="pink" icon={Archive} title="Archived" value={count.total_archived} />
        <StatisticCard colorKey="orange" icon={Workflow} title="Subcontractors" value={count.total_subcontractors} />
      </div>
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