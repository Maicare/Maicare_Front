"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { ClipboardList, AlertTriangle, AlertCircle } from "lucide-react";
import Table from "@/components/common/Table/Table";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/table-core";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { IntakeFormType } from "@/types/intake.types";
import { Any } from "@/common/types/types";

const stats = [
  { label: "Active clients", value: 152 },
  { label: "Waitlist", value: 43 },
  { label: "Pending intakes", value: 27 },
  { label: "Contract expirations", value: 8 },
  { label: "Recent incidents", value: 3 },
  { label: "Clients near discharge", value: 12 },
];

const quickNavLinks = [
  { label: "Clients", href: "/clients" },
  { label: "Employees", href: "/employees" },
  { label: "Contracts", href: "/contracts" },
  { label: "Reports", href: "/reports" },
];

const fakeWaitListData: Partial<IntakeFormType>[] = [
  {
    id: '1',
    first_name: "Alice",
    last_name: "Smith",
    urgency_score: 9,
    signature_date: "2025-04-01",
    referrer_name: "Dr. Adams",
  },
  {
    id: '2',
    first_name: "Bob",
    last_name: "Johnson",
    urgency_score: 5,
    signature_date: "2025-03-28",
    referrer_name: "Dr. Baker",
  },
  {
    id: '3',
    first_name: "Carol",
    last_name: "Brown",
    urgency_score: 7,
    signature_date: "2025-03-30",
    referrer_name: "Dr. Carter",
  },
];

const fakeActiveCareData = [
  {
    id: "1",
    first_name: "Alice",
    last_name: "Smith",
    bsn: "123456789",
    coordinator: "John Doe",
    location: "Amsterdam",
    contract_end_date: "2025-12-31",
  },
  {
    id: "2",
    first_name: "Bob",
    last_name: "Johnson",
    bsn: "987654321",
    coordinator: "Jane Doe",
    location: "Rotterdam",
    contract_end_date: "2025-11-30",
  },
  {
    id: "3",
    first_name: "Charlie",
    last_name: "Brown",
    bsn: "654321987",
    coordinator: "Sam Smith",
    location: "Utrecht",
    contract_end_date: "2025-10-15",
  },
];

const fakeDischargeData = [
  {
    id: "1",
    first_name: "Alice",
    last_name: "Smith",
    entry_date: "2025-04-20",
    discharge_date: "2025-05-01",
    days_spent: 101,
    reason: "Recovered",
  },
  {
    id: "2",
    first_name: "Bob",
    last_name: "Johnson",
    entry_date: "2025-04-05",
    discharge_date: "2025-04-20",
    days_spent: 150,
    reason: "Transferred",
  },
  {
    id: "3",
    first_name: "Carol",
    last_name: "Brown",
    entry_date: "2025-04-01",
    discharge_date: "2025-04-15",
    days_spent: 214,
    reason: "Transferred",
  },
];





const DashboardPage = () => {
  const router = useRouter();

  const waitlistColumnDef = useMemo<ColumnDef<Partial<IntakeFormType>>[]>(() => [
    {
      id: "full_name",
      header: () => "Volledige Naam",
      accessorFn: (client) => `${client.first_name} ${client.last_name}`,
    },
    {
      id: "urgency",
      header: () => "Urgency",
      accessorKey: "urgency_score",
      cell: (info) => <span>{Number(info.getValue())}/10</span>,
    },
    {
      id: "signature_date",
      header: () => "Submission Date",
      accessorKey: "signature_date",
      cell: (info) => info.getValue(),
    },
    {
      id: "referrer",
      header: () => "Referrer",
      accessorKey: "referrer_name",
      cell: (info) => info.getValue() || "N/A",
    },
  ], []);

  const activeCareTrajectoryColumns = useMemo<ColumnDef<Partial<IntakeFormType>>[]>(() => [
    {
      id: "clientName",
      header: () => <span className="whitespace-nowrap">Client name</span>,
      accessorFn: (row: Any) => `${row.first_name} ${row.last_name}`,
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "bsn",
      header: () => <span className="whitespace-nowrap">BSN</span>,
      accessorKey: "bsn",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "coordinator",
      header: () => <span className="whitespace-nowrap">Assigned Coordinator</span>,
      accessorKey: "coordinator",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "location",
      header: () => <span className="whitespace-nowrap">Location</span>,
      accessorKey: "location",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "contractEndDate",
      header: () => <span className="whitespace-nowrap">Contract End Date</span>,
      accessorKey: "contract_end_date",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
  ], []);

  const dischargeManagementColumns = useMemo<ColumnDef<Any>[]>(() => [
    {
      id: "clientName",
      header: () => <span className="whitespace-nowrap">Client Name</span>,
      accessorFn: (row: Any) => `${row.first_name} ${row.last_name}`,
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "entry_date",
      header: () => <span className="whitespace-nowrap">Entry Date</span>,
      accessorKey: "entry_date",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "discharge_date",
      header: () => <span className="whitespace-nowrap">Discharge Date</span>,
      accessorKey: "discharge_date",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "days_spent",
      header: () => <span className="whitespace-nowrap">Days Spent</span>,
      accessorKey: "days_spent",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
    {
      id: "reason",
      header: () => <span className="whitespace-nowrap">Reason</span>,
      accessorKey: "reason",
      cell: (info: Any) => <span className="whitespace-nowrap">{info.getValue()}</span>,
    },
  ], []);

  const handleRowClick = (client: Partial<IntakeFormType>) => {
    // Navigation logic here...
  };

  const handleCareTrajectoryRowClick = (trajectory: Any) => {
    // Navigation logic here...
  };

  const handleDischargeRowClick = (row: Any) => {
    console.log("Discharge row clicked:", row);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Quick Navigation Section */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Quick Navigation</h2>
        <div className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4">
          {quickNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quick Stats</h2>
        <div className="bg-white shadow rounded-lg p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
            >
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className="mt-2 text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks & Alerts Section */}
      <div className="mb-8 lg:flex lg:gap-8 items-stretch">
        {/* My Tasks */}
        <div className="lg:w-1/2 flex flex-col">
          <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
            <ClipboardList className="mr-2" size={28} />
            My Tasks
          </h2>
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 flex-1 overflow-auto">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Overdue objectives (3)</li>
              <li>Pending intake form reviews (2)</li>
              <li>Incident follow ups (1)</li>
              <li>Upcoming meetings (4)</li>
              <li>Clients training (4)</li>
            </ul>
          </div>
        </div>
        {/* Alerts */}
        <div className="lg:w-1/2 flex flex-col">
          <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
            <AlertTriangle className="mr-2" size={28} />
            Alerts
          </h2>
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 flex-1 overflow-auto">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span>Incoming expiring contracts:</span>
                <span className="ml-2 font-bold text-red-600">3</span>
                <AlertCircle className="ml-1 text-red-600" size={18} />
              </li>
              <li className="flex items-center">
                <span>Scheduled status changes of clients:</span>
                <span className="ml-2 font-bold text-orange-600">5</span>
                <AlertCircle className="ml-1 text-orange-600" size={18} />
              </li>
              <li className="flex items-center">
                <span>Medication alerts:</span>
                <span className="ml-2 font-bold text-red-600">2</span>
                <AlertCircle className="ml-1 text-red-600" size={18} />
              </li>
              <li className="flex items-center">
                <span>High severity incidents:</span>
                <span className="ml-2 font-bold text-red-600">1</span>
                <AlertTriangle className="ml-1 text-red-600" size={18} />
              </li>
              <li className="flex items-center">
                <span>New compliance issues:</span>
                <span className="ml-2 font-bold text-red-600">4</span>
                <AlertCircle className="ml-1 text-red-600" size={18} />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Waitlist & Active Care Trajectories Section */}
      <div className="mb-8 lg:flex lg:gap-8 items-stretch">
        {/* Waitlist Overview */}
        <div className="lg:w-1/2 flex flex-col mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Waitlist Overview</h2>
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 overflow-x-auto overflow-y-auto flex-1 min-h-[300px]">
            <Table
              onRowClick={handleRowClick}
              data={fakeWaitListData}
              columns={waitlistColumnDef}
            />
          </div>
        </div>
        {/* Active Care Trajectories */}
        <div className="lg:w-1/2 flex flex-col mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Care Trajectories</h2>
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 overflow-x-auto overflow-y-auto flex-1 min-h-[300px]">
            <Table
              onRowClick={handleCareTrajectoryRowClick}
              data={fakeActiveCareData}
              columns={activeCareTrajectoryColumns}
            />
          </div>
        </div>
      </div>

      {/* Discharge Management Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Discharge Management</h2>
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 overflow-x-auto">
          <Table
            onRowClick={handleDischargeRowClick}
            data={fakeDischargeData}
            columns={dischargeManagementColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(
  withPermissions(DashboardPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewDashboard,
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);