import { z } from "zod";


// Zod Schema
export const IncidentCreateSchema = z.object({
    accident: z.boolean(),
    additional_appointments: z.string(),
    cause_explanation: z.string(),
    client_absence: z.boolean(),
    client_options: z.array(z.string()),
    emails: z.array(z.string()),
    employee_absenteeism: z.string(),
    employee_id: z.string().min(1, "Medewerker is verplicht"),
    fire_water_damage: z.boolean(),
    incident_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
    incident_explanation: z.string(),
    incident_prevent_steps: z.string(),
    incident_taken_measures: z.string(),
    incident_type: z.string(),
    inform_who: z.array(z.string()),
    location_id: z.string().min(1, "Locatie is verplicht"),
    medicines: z.boolean(),
    mese_worker: z.array(z.string()),
    needed_consultation: z.string().min(1, "Psychische schade is verplicht"),
    organization: z.boolean(),
    organizational: z.array(z.string()),
    other: z.boolean(),
    other_cause: z.string(),
    other_desc: z.string(),
    other_notifications: z.boolean(),
    passing_away: z.boolean(),
    physical_injury: z.string().min(1, "Psychische schade is verplicht"),
    physical_injury_desc: z.string(),
    psychological_damage: z.string(),
    psychological_damage_desc: z.string(),
    recurrence_risk: z.string().min(1, "Psychische schade is verplicht"),
    reporter_involvement: z.string().min(1, "Psychische schade is verplicht"),
    runtime_incident: z.string(),
    self_harm: z.boolean(),
    severity_of_incident: z.string().min(1, "Psychische schade is verplicht"),
    succession: z.array(z.string()),
    succession_desc: z.string(),
    technical: z.array(z.string()),
    use_prohibited_substances: z.boolean(),
    violence: z.boolean(),
});

// Infer Type from Zod Schema (alternative to manual interface)
export type CreateIncidentNew = z.infer<typeof IncidentCreateSchema>;