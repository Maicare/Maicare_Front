import { status } from "nprogress";
import { z } from "zod";

export const createResourceSchema = z.object({
    is_obtained: z.boolean().default(false),
    resource_description: z.string().min(1, "Beschrijving is verplicht"),
    obtained_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Behaaldatum is verplicht",
    }),
});

export const createSupportNetworkSchema = z.object({
    role_title: z.string().min(1, "Rol titel is verplicht"),
    responsibility_description: z.string().min(1, "Verantwoordelijkheidsbeschrijving is verplicht"),
});

export const createRiskSchema = z.object({
    risk_description: z.string().min(1, "Risicobeschrijving is verplicht"),
    mitigation_strategy: z.string().min(1, "Mitigatiestrategie is verplicht"),
    risk_level: z.enum(["high", "medium", "low"], {
        required_error: "Risiconiveau is verplicht",
        invalid_type_error: "Risiconiveau moet een van de volgende zijn: high, medium, low"
    }),
});

export const createSuccessMetricSchema = z.object({
    metric_name: z.string().min(1, "Metric naam is verplicht"),
    target_value: z.string().min(1, "Doelwaarde is verplicht"),
    current_value: z.string().min(1, "Huidige waarde is verplicht"),
    measurement_method: z.string().min(1, "Meetmethode is verplicht"),
});

export const createInterventionSchema = z.object({
    frequency: z.enum(["daily","weekly","monthly"],{
        required_error: "Frequentie is verplicht",
        invalid_type_error: "Frequentie moet een van de volgende zijn: daily, weekly, monthly"
    }),
    intervention_description: z.string().min(1, "Interventiebeschrijving is verplicht"),
});

export const createObjectiveSchema = z.object({
    description: z.string().min(1, "Beschrijving is verplicht"),
    goal_title: z.string().min(1, "Titel is verplicht"),
    timeframe: z.enum(["short_term","long_term","medium_term"],{
        required_error: "Tijdsframe is verplicht",
        invalid_type_error: "Tijdsframe moet een van de volgende zijn: short_term, long_term, medium_term"
    }),
    status: z.enum(["draft", "not_started", "in_progress", "completed"], {
        required_error: "Status is verplicht",
        invalid_type_error: "Status moet een van de volgende zijn: draft, not_started, in_progress, completed"
    }).optional(),
});

export const createActionSchema = z.object({
    action_description: z.string().min(1, "Actiebeschrijving is verplicht"),
});

export const updateOverviewSchema = z.object({
    assessment_summary: z.string().min(1, "Samenvatting is verplicht"),
});

export const createReportSchema = z.object({
    report_content: z.string().min(1, "Rapportinhoud is verplicht"),
    report_type: z.enum(['progress', 'concern', 'achievement', 'modification'], {
        required_error: "Rapporttype is verplicht",
        invalid_type_error: "Rapporttype moet een van de volgende zijn: progress, concern, achievement, modification"
    }),
    is_critical: z.boolean().default(false),
});

export type CreateReport = z.infer<typeof createReportSchema>;
export type UpdateOverview = z.infer<typeof updateOverviewSchema>;
export type CreateAction = z.infer<typeof createActionSchema>;
export type CreateObjective = z.infer<typeof createObjectiveSchema>;
export type CreateIntervention = z.infer<typeof createInterventionSchema>;
export type CreateSuccessMetric = z.infer<typeof createSuccessMetricSchema>;
export type CreateRisk = z.infer<typeof createRiskSchema>;
export type CreateSupportNetwork = z.infer<typeof createSupportNetworkSchema>;
export type CreateResource = z.infer<typeof createResourceSchema>;