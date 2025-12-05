'use client';

import { useState } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Plus, Search, Download, ArrowRight, CheckCircle, Clock, FileText, Edit, Eye, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoorstroomDialog } from "./DoorstroomDialog";
import { Button } from "../ui/button";
import { useLocationTransfer } from "@/hooks/client/use-location-transfer";

interface Doorstroom {
  id: string;
  clientNaam: string;
  vanLocatie: string;
  naarLocatie: string;
  reden: string;
  aanvraagDatum: string;
  status: "aanvraag" | "akkoord" | "verwerkt";
  oudeMentor: string;
  nieuweMentor: string;
}

const mockDoorstromen: Doorstroom[] = [
  {
    id: "1",
    clientNaam: "Liam van Dijk",
    vanLocatie: "Amsterdam Zuid",
    naarLocatie: "Amsterdam Noord",
    reden: "Dichter bij familie",
    aanvraagDatum: "15-01-2025",
    status: "aanvraag",
    oudeMentor: "Maria Jansen",
    nieuweMentor: "Peter de Boer",
  },
  {
    id: "2",
    clientNaam: "Zoey Mulder",
    vanLocatie: "Rotterdam Centrum",
    naarLocatie: "Rotterdam West",
    reden: "Intensivering zorg",
    aanvraagDatum: "12-01-2025",
    status: "akkoord",
    oudeMentor: "Ahmed Hassan",
    nieuweMentor: "Lisa Vermeulen",
  },
  {
    id: "3",
    clientNaam: "Sem Bakker",
    vanLocatie: "Utrecht West",
    naarLocatie: "Utrecht Oost",
    reden: "Afbouw zorg",
    aanvraagDatum: "08-01-2025",
    status: "verwerkt",
    oudeMentor: "Fatima El-Amrani",
    nieuweMentor: "Jan Schouten",
  },
];

const statusConfig = {
  aanvraag: { label: "Aanvraag", variant: "secondary" as const, icon: FileText, color: "text-yellow-500" },
  akkoord: { label: "Akkoord", variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
  verwerkt: { label: "Verwerkt", variant: "default" as const, icon: CheckCircle, color: "text-primary" },
};

export function DoorstroomTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoorstroom, setSelectedDoorstroom] = useState<Doorstroom | undefined>();
  const {requestTransfers} = useLocationTransfer({ autoFetch: true });

  const filteredDoorstromen = mockDoorstromen.filter((doorstroom) => {
    const matchesSearch = doorstroom.clientNaam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doorstroom.vanLocatie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doorstroom.naarLocatie.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "alle" || doorstroom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    aanvraag: mockDoorstromen.filter(d => d.status === "aanvraag").length,
    akkoord: mockDoorstromen.filter(d => d.status === "akkoord").length,
    verwerkt: mockDoorstromen.filter(d => d.status === "verwerkt").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aanvragen</p>
              <p className="text-2xl font-bold mt-1">{stats.aanvraag}</p>
            </div>
            <FileText className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Akkoord</p>
              <p className="text-2xl font-bold mt-1">{stats.akkoord}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verwerkt</p>
              <p className="text-2xl font-bold mt-1">{stats.verwerkt}</p>
            </div>
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of locatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle statussen</SelectItem>
              <SelectItem value="aanvraag">Aanvraag</SelectItem>
              <SelectItem value="akkoord">Akkoord</SelectItem>
              <SelectItem value="verwerkt">Verwerkt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <PrimaryButton
            text="Exporteren"
            icon={Download}
            className="flex-1 sm:flex-none bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
            disabled={false}
          />
          <PrimaryButton
            text="Nieuwe Doorstroom"
            onClick={() => {
              setSelectedDoorstroom(undefined);
              setDialogOpen(true);
            }}
            disabled={false}
            icon={Plus}
            animation="animate-bounce"
            className="flex-1 sm:flex-none bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          />
        </div>
      </div>

      {/* Doorstromen List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDoorstromen.map((doorstroom) => {
          const config = statusConfig[doorstroom.status];
          const Icon = config.icon;
          
          return (
            <Card key={doorstroom.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
    {/* Main Content */}
    <div className="flex-1 space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-xl text-gray-900">{doorstroom.clientNaam}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Aanvraag: {doorstroom.aanvraagDatum}
          </p>
        </div>
        <Badge variant={config.variant} className="gap-1.5 px-3 py-1.5 text-sm">
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </Badge>
      </div>
      
      {/* Location Transfer Section */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
        <div className="flex items-center justify-between">
          {/* From Location */}
          <div className="flex-1 text-center space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Van</p>
              <p className="font-semibold text-gray-900">{doorstroom.vanLocatie}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mentor</p>
              <p className="text-sm font-medium text-gray-700">{doorstroom.oudeMentor}</p>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="px-4">
            <ArrowRight className="w-6 h-6 text-blue-500 flex-shrink-0" />
          </div>
          
          {/* To Location */}
          <div className="flex-1 text-center space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Naar</p>
              <p className="font-semibold text-gray-900">{doorstroom.naarLocatie}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mentor</p>
              <p className="text-sm font-medium text-gray-700">{doorstroom.nieuweMentor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reason Section */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Reden van doorstroom</p>
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-gray-900 leading-relaxed">{doorstroom.reden}</p>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex lg:flex-col gap-3 lg:min-w-[120px]">
      <Button 
        onClick={() => {
          setSelectedDoorstroom(doorstroom);
          setDialogOpen(true);
        }}
        variant="outline"
        className="flex-1 lg:flex-none bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <Eye className="w-4 h-4 mr-2" />
        Details
      </Button>
      <Button 
        onClick={() => {
          setSelectedDoorstroom(doorstroom);
          setDialogOpen(true);
        }}
        variant="outline"
        className="flex-1 lg:flex-none bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
      >
        <Edit className="w-4 h-4 mr-2" />
        Bewerken
      </Button>
    </div>
  </div>
</Card>
          );
        })}
      </div>

      <DoorstroomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doorstroom={selectedDoorstroom}
      />
    </div>
  );
}
