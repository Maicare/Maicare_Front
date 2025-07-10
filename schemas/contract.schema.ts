import { z } from 'zod';

// Define enums with your specific values
export const CareTypeSchema = z.enum(["ambulante", "accommodation"]);
export type CareType = z.infer<typeof CareTypeSchema>;

export const FinancingActSchema = z.enum(["WMO", "ZVW", "WLZ", "JW", "WPG"]);
export type FinancingAct = z.infer<typeof FinancingActSchema>;

export const FinancingOptionSchema = z.enum(["ZIN", "PGB"]);
export type FinancingOption = z.infer<typeof FinancingOptionSchema>;

export const AmbulantePriceTimeUnitSchema = z.enum(["minute", "hourly"]);
export const AccommodationPriceTimeUnitSchema = z.enum(["daily", "weekly", "monthly"]);

// Base schema with common fields
const BaseContractSchema = z.object({
  VAT: z.number().min(0).max(100),
  attachment_ids: z.array(z.string()).optional(),
  care_name: z.string().min(1, "Care name is required"),
  care_type: CareTypeSchema,
  end_date: z.string().datetime().optional(),
  financing_act: FinancingActSchema,
  financing_option: FinancingOptionSchema,
  price: z.number().positive("Price must be positive"),
  reminder_period: z.number().int().min(0).max(365),
  sender_id: z.number().int().positive(),
  start_date: z.string().datetime({ message: "Invalid date format" }),
  type_id: z.number().int().positive(),
});

// Create Contract schema with conditional validation
export const CreateContractSchema = BaseContractSchema.extend({
  hours: z.number().positive().nullable(),
  hours_type: z.string().nullable(),
  price_time_unit: z.string(),
}).superRefine((data, ctx) => {
  if (data.care_type === "ambulante") {
    if (data.hours === null || data.hours === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hours are required for ambulante care",
        path: ["hours"],
      });
    }
    if (!data.hours_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hours type is required for ambulante care",
        path: ["hours_type"],
      });
    }
    if (!data.price_time_unit || !["minute", "hourly"].includes(data.price_time_unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price time unit must be daily, weekly, or monthly for ambulante care",
        path: ["price_time_unit"],
      });
    }
  } else if (data.care_type === "accommodation") {
    if (data.hours !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hours must be null for accommodation care",
        path: ["hours"],
      });
    }
    if (data.hours_type !== null) {
      console.log("Accommodation care does not require hours type" + data.hours_type);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hours type must be null for accommodation care",
        path: ["hours_type"],
      });
    }
    if (!data.price_time_unit || !["daily", "weekly", "monthly"].includes(data.price_time_unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price time unit must be minute or hourly for accommodation care",
        path: ["price_time_unit"],
      });
    }
  }
});

// Full Contract schema (for responses)
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