"use client";
import { useI18n } from "@/lib/i18n/client";

export function useDocumentTypeOptions() {
    const t = useI18n();

    return [
        { label: t('clients.documents.types.selectDocument'), value: "" },
        { label: t('clients.documents.types.registration_form'), value: "registration_form" },
        { label: t('clients.documents.types.intake_form'), value: "intake_form" },
        { label: t('clients.documents.types.consent_form'), value: "consent_form" },
        { label: t('clients.documents.types.risk_assessment'), value: "risk_assessment" },
        { label: t('clients.documents.types.self_reliance_matrix'), value: "self_reliance_matrix" },
        { label: t('clients.documents.types.force_inventory'), value: "force_inventory" },
        { label: t('clients.documents.types.care_plan'), value: "care_plan" },
        { label: t('clients.documents.types.signaling_plan'), value: "signaling_plan" },
        { label: t('clients.documents.types.cooperation_agreement'), value: "cooperation_agreement" },
        { label: t('clients.documents.types.other'), value: "other" },
    ];
}