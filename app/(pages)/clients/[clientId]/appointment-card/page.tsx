"use client";

import React, { FunctionComponent, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Download, Pencil } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Info,
  Users,
  Home,
  Building2,
  Stethoscope,
  GraduationCap,
  Plane,
  CalendarDays,
  Cigarette,
  Briefcase,
  Handshake,
} from "lucide-react";

import { useAppointment } from "@/hooks/client/use-appointment";

import Panel from "@/components/common/Panel/Panel";
import IconButton from "@/components/common/Buttons/IconButton";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import PrimaryButton from "@/common/components/PrimaryButton";

const defaultAppointment = {
  general_information: [] as string[],
  household_info: [] as string[],
  important_contacts: [] as string[],
  leave: [] as string[],
  organization_agreements: [] as string[],
  school_internship: [] as string[],
  travel: [] as string[],
  smoking_rules: [] as string[],
  treatment_agreements: [] as string[],
  work: [] as string[],
  youth_officer_agreements: [] as string[],
};

const EmergencyContactPage: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();

  const { appointments, downloadPDF } = useAppointment(clientId || "0");
  const appointmentData = appointments || defaultAppointment;

  const allSectionsEmpty = Object.values(appointmentData).every(
    (items) => items.length === 0
  );

  const renderSection = useCallback(
    (title: string, items: string[], Icon: LucideIcon) => (
      <section className="space-y-4 border-l-4 border-blue-500 pl-5 group transition-all duration-300 hover:border-blue-600">
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />
          <h2 className="text-sm font-semibold tracking-wider text-primary-600 uppercase group-hover:text-primary-700">
            {title}
          </h2>
        </div>

        <ul className="space-y-2">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 min-w-0">
                <ChevronRight className="w-5 h-5 text-blue-500 group-hover:text-blue-600 mt-0.5 flex-none" />
                <p className="flex-1 whitespace-pre-wrap break-words break-all text-gray-700 group-hover:text-gray-800">
                  {item}
                </p>
              </li>
            ))
          ) : (
            <li className="italic text-gray-400">Geen items gevonden</li>
          )}
        </ul>
      </section>
    ),
    []
  );

  const handleDownload = async () => {
    const url = await downloadPDF();
    const link = document.createElement("a");
    link.href = url.toString();
    link.download = `appointment_${clientId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!clientId) return null;

  if (allSectionsEmpty) {
    return (
      <Panel
        title={`Afsprakenkaart Chrystal voor cliënt ${clientId}`}
        header={
          <div className="flex w-full justify-end gap-2">
            <PrimaryButton
              text="Download"
              icon={Download}
              animation="none"
              onClick={handleDownload}
              className="bg-indigo-200 text-indigo-700 hover:text-white hover:bg-indigo-500"
            />
            <Link href={`/clients/${clientId}/appointment-card/edit`}>
              <PrimaryButton
                text="Bewerken"
                icon={Pencil}
                animation="animate-bounce"
                className="bg-blue-500 hover:bg-blue-700 text-white transition-colors duration-300"
              />
            </Link>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-12">
          <LargeErrorMessage
            firstLine="Ontbrekende afspraakinformatie"
            secondLine="Het lijkt erop dat er nog geen gegevens zijn ingevoerd."
            className="shadow-none bg-transparent px-0 py-0"
          />
          <Link
            href={`/clients/${clientId}/appointment-card/edit`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            <Pencil className="w-4 h-4" />
            Afspraakkaart invullen
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title={`Afsprakenkaart Chrystal voor cliënt ${clientId}`}
      header={
        <div className="flex w-full justify-end gap-2">
          <PrimaryButton
            text="Download"
            icon={Download}
            animation="none"
            onClick={handleDownload}
            className="bg-indigo-200 text-indigo-700 hover:text-white hover:bg-indigo-500"
          />
          <Link href={`/clients/${clientId}/appointment-card/edit`}>
            <PrimaryButton
              text="Bewerken"
              icon={Pencil}
              animation="animate-bounce"
              className="bg-blue-500 hover:bg-blue-700 text-white transition-colors duration-300"
            />
          </Link>
        </div>
      }
    >
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {renderSection(
          "Algemeen",
          appointmentData.general_information,
          Info
        )}
        {renderSection(
          "Belangrijke contacten",
          appointmentData.important_contacts,
          Users
        )}
        {renderSection(
          "Huishouden",
          appointmentData.household_info,
          Home
        )}
        {renderSection(
          "Organisatie afspraken",
          appointmentData.organization_agreements,
          Building2
        )}
        {renderSection(
          "Afspraken met betrekking tot behandeling",
          appointmentData.treatment_agreements,
          Stethoscope
        )}
        {renderSection(
          "Schoolstage",
          appointmentData.school_internship,
          GraduationCap
        )}
        {renderSection("Reizen", appointmentData.travel, Plane)}
        {renderSection("Verlof", appointmentData.leave, CalendarDays)}
        {renderSection(
          "Rookbeleid",
          appointmentData.smoking_rules,
          Cigarette
        )}
        {renderSection("Werk", appointmentData.work, Briefcase)}
        {renderSection(
          "Jeugdambtenaar Afspraken",
          appointmentData.youth_officer_agreements,
          Handshake
        )}
      </div>
    </Panel>
  );
};

export default EmergencyContactPage;
