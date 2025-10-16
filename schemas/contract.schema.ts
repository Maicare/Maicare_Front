import { z } from 'zod';

// Definieer enums met specifieke waarden
export const CareTypeSchema = z.enum(["ambulante", "accommodation"]);
export type CareType = z.infer<typeof CareTypeSchema>;

export const FinancingActSchema = z.enum(["WMO", "ZVW", "WLZ", "JW", "WPG"]);
export type FinancingAct = z.infer<typeof FinancingActSchema>;

export const FinancingOptionSchema = z.enum(["ZIN", "PGB"]);
export type FinancingOption = z.infer<typeof FinancingOptionSchema>;

export const AmbulantePriceTimeUnitSchema = z.enum(["minute", "hourly"]);
export const AccommodationPriceTimeUnitSchema = z.enum(["daily", "weekly", "monthly"]);

// Basis schema met gemeenschappelijke velden
const BaseContractSchema = z.object({
  VAT: z.number().min(0).max(100),
  attachment_ids: z.array(z.string()).optional(),
  care_name: z.string().min(1, "Zorgnaam is verplicht"),
  care_type: CareTypeSchema,
  end_date: z.string().datetime().optional(),
  financing_act: FinancingActSchema,
  financing_option: FinancingOptionSchema,
  price: z.number().positive("Prijs moet positief zijn"),
  reminder_period: z.number().int().min(0).max(365),
  sender_id: z.number().int().positive(),
  start_date: z.string().datetime({ message: "Ongeldig datumformaat" }),
  type_id: z.number().int().positive(),
});

// Maak Contract schema met conditionele validatie
export const CreateContractSchema = BaseContractSchema.extend({
  hours: z.number().positive().nullable(),
  hours_type: z.string().nullable(),
  price_time_unit: z.string(),
}).superRefine((data, ctx) => {
  if (data.care_type === "ambulante") {
    if (data.hours === null || data.hours === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Uren zijn verplicht voor ambulante zorg",
        path: ["hours"],
      });
    }
    if (!data.hours_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Urentype is verplicht voor ambulante zorg",
        path: ["hours_type"],
      });
    }
    if (!data.price_time_unit || !["minute", "hourly"].includes(data.price_time_unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prijs tijdseenheid moet 'minute' of 'hourly' zijn voor ambulante zorg",
        path: ["price_time_unit"],
      });
    }
  } else if (data.care_type === "accommodation") {
    if (data.hours !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Uren moeten null zijn voor accommodatie zorg",
        path: ["hours"],
      });
    }
    if (data.hours_type !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Urentype moet null zijn voor accommodatie zorg",
        path: ["hours_type"],
      });
    }
    if (!data.price_time_unit || !["daily", "weekly", "monthly"].includes(data.price_time_unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prijs tijdseenheid moet 'daily', 'weekly' of 'monthly' zijn voor accommodatie zorg",
        path: ["price_time_unit"],
      });
    }
  }
});

// Volledig Contract schema (voor responses)
export const ContractSchema = BaseContractSchema.extend({
  id: z.number().int().positive(),
  client_id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.enum(["draft", "approved", "terminated", "stoped"]),
  hours: z.number().positive().nullable(),
  hours_type: z.string().nullable(),
  price_time_unit: z.string(),
  departure_reason: z.string(),
  departure_report: z.string(),
});

// TypeScript types
export type CreateContract = z.infer<typeof CreateContractSchema>;
export type Contract = z.infer<typeof ContractSchema>;