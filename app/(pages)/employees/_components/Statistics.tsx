"use client";
import StatisticCard from '@/common/components/StatisticCard'
import { useEmployee } from '@/hooks/employee/use-employee';
import { EmployeeCount } from '@/types/employee.types';
import { Archive, Outdent, Users, Workflow } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Statistics = () => {
    const [count, setCount] = useState<EmployeeCount>({
        total_archived: 0,
        total_employees: 0,
        total_out_of_service: 0,
        total_subcontractors: 0
    });
    const { readCount } = useEmployee({ autoFetch: false,v:"statistics" });
    useEffect(() => {
        const fetchCount = async () => {
            const count = await readCount();
            setCount(count);
        }
        fetchCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="w-full grid lg:grid-cols-[repeat(4,230px)] grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)] justify-between mb-5 ">
            <StatisticCard colorKey="teal" icon={Users} title="Medewerkers" value={count.total_employees} />
            <StatisticCard colorKey="sky" icon={Outdent} title="Uit Dienst" value={count.total_out_of_service} />
            <StatisticCard colorKey="pink" icon={Archive} title="Archived" value={count.total_archived} />
            <StatisticCard colorKey="orange" icon={Workflow} title="Subcontractors" value={count.total_subcontractors} />
        </div>
    )
}

export default Statistics