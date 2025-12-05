'use client';

import { useState } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Bell, Calendar, FileText, AlertCircle, CheckCircle, Clock, Eye, Circle, User, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

interface Herinnering {
  id: string;
  type: "herindicatie" | "evaluatie" | "rapportage" | "afspraak";
  clientNaam: string;
  beschrijving: string;
  deadline: string;
  urgentie: "hoog" | "middel" | "laag";
  status: "openstaand" | "in_behandeling" | "afgerond";
  coordinator: string;
}

const mockHerinneringen: Herinnering[] = [
  {
    id: "1",
    type: "herindicatie",
    clientNaam: "Tim Hoekstra",
    beschrijving: "Herindicatie aanvragen voor verlenging zorg",
    deadline: "15-01-2025",
    urgentie: "hoog",
    status: "openstaand",
    coordinator: "Dr. Sarah van der Berg",
  },
  {
    id: "2",
    type: "evaluatie",
    clientNaam: "Julia Vermeer",
    beschrijving: "Kwartaal evaluatie zorgplan",
    deadline: "25-01-2025",
    urgentie: "middel",
    status: "in_behandeling",
    coordinator: "Dr. Mohammed El-Amin",
  },
  {
    id: "3",
    type: "rapportage",
    clientNaam: "Sara Al-Hassan",
    beschrijving: "Maandrapportage ontbreekt",
    deadline: "20-01-2025",
    urgentie: "hoog",
    status: "openstaand",
    coordinator: "Drs. Linda Bakker",
  },
  {
    id: "4",
    type: "afspraak",
    clientNaam: "Daan Peters",
    beschrijving: "MDO met ketenpartners",
    deadline: "22-01-2025",
    urgentie: "middel",
    status: "in_behandeling",
    coordinator: "Dr. Sarah van der Berg",
  },
];

const typeConfig = {
  herindicatie: { label: "Herindicatie", icon: FileText, color: "bg-purple-500" },
  evaluatie: { label: "Evaluatie", icon: CheckCircle, color: "bg-blue-500" },
  rapportage: { label: "Rapportage", icon: FileText, color: "bg-green-500" },
  afspraak: { label: "Afspraak", icon: Calendar, color: "bg-orange-500" },
};

const urgentieConfig = {
  hoog: { label: "Hoog", variant: "destructive" as const, icon: AlertCircle },
  middel: { label: "Middel", variant: "secondary" as const, icon: Clock },
  laag: { label: "Laag", variant: "outline" as const, icon: Bell },
};

const statusConfig = {
  openstaand: { label: "Openstaand", variant: "default" as const },
  in_behandeling: { label: "In Behandeling", variant: "secondary" as const },
  afgerond: { label: "Afgerond", variant: "outline" as const },
};

export function HerinneringenTab() {
  const [typeFilter, setTypeFilter] = useState<string>("alle");
  const [urgentieFilter, setUrgentieFilter] = useState<string>("alle");
  const [statusFilter, setStatusFilter] = useState<string>("alle");

  const filteredHerinneringen = mockHerinneringen.filter((herinnering) => {
    const matchesType = typeFilter === "alle" || herinnering.type === typeFilter;
    const matchesUrgentie = urgentieFilter === "alle" || herinnering.urgentie === urgentieFilter;
    const matchesStatus = statusFilter === "alle" || herinnering.status === statusFilter;
    return matchesType && matchesUrgentie && matchesStatus;
  });

  const stats = {
    totaal: mockHerinneringen.length,
    hoog: mockHerinneringen.filter(h => h.urgentie === "hoog").length,
    openstaand: mockHerinneringen.filter(h => h.status === "openstaand").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Totaal Herinneringen</p>
              <p className="text-2xl font-bold mt-1">{stats.totaal}</p>
            </div>
            <Bell className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hoge Urgentie</p>
              <p className="text-2xl font-bold mt-1">{stats.hoog}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Openstaand</p>
              <p className="text-2xl font-bold mt-1">{stats.openstaand}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter op type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle types</SelectItem>
            <SelectItem value="herindicatie">Herindicatie</SelectItem>
            <SelectItem value="evaluatie">Evaluatie</SelectItem>
            <SelectItem value="rapportage">Rapportage</SelectItem>
            <SelectItem value="afspraak">Afspraak</SelectItem>
          </SelectContent>
        </Select>
        <Select value={urgentieFilter} onValueChange={setUrgentieFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter op urgentie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle urgentie</SelectItem>
            <SelectItem value="hoog">Hoog</SelectItem>
            <SelectItem value="middel">Middel</SelectItem>
            <SelectItem value="laag">Laag</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter op status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle statussen</SelectItem>
            <SelectItem value="openstaand">Openstaand</SelectItem>
            <SelectItem value="in_behandeling">In Behandeling</SelectItem>
            <SelectItem value="afgerond">Afgerond</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Herinneringen List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredHerinneringen.map((herinnering) => {
          const typeConf = typeConfig[herinnering.type];
          const urgentieConf = urgentieConfig[herinnering.urgentie];
          const statusConf = statusConfig[herinnering.status];
          const TypeIcon = typeConf.icon;
          const UrgentieIcon = urgentieConf.icon;
          
          return (
            <Card key={herinnering.id} className="p-5 hover:shadow-md transition-all duration-200">
  <div className="flex items-start justify-between gap-4">
    {/* Main Content */}
    <div className="flex-1 space-y-3">
      {/* Header with Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${typeConf.color} bg-opacity-10 mt-1 flex-shrink-0`}>
            <TypeIcon className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-gray-900">{herinnering.clientNaam}</h3>
            <p className="text-sm text-gray-600">{herinnering.beschrijving}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Badge variant={urgentieConf.variant} className="gap-1 px-2 py-1 text-xs">
            <UrgentieIcon className="w-3 h-3" />
            {urgentieConf.label}
          </Badge>
          <Badge variant="outline" className={`text-xs ${typeConf.color}`}>
            {typeConf.label}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">Deadline</p>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <p className="font-medium text-gray-900">{herinnering.deadline}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">Coördinator</p>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-gray-400" />
            <p className="font-medium text-gray-900">{herinnering.coordinator}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">Status</p>
          <Badge variant={statusConf.variant} className="text-xs">
            {statusConf.label}
          </Badge>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-col gap-2">
      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <Eye className="w-4 h-4 mr-1" />
        Details
      </Button>
      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
        <CheckCircle className="w-4 h-4 mr-1" />
        Afgerond
      </Button>
    </div>
  </div>
</Card>
          );
        })}
      </div>
    </div>
  );
}
