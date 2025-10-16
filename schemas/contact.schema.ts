import { OP_CLIENT_TYPE } from '@/types/contacts.types';
import { z } from 'zod';

export type OpClientType = typeof OP_CLIENT_TYPE[number];

// Schema voor individueel contact in de contacten array
const ContactPersonSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  name: z.string().min(1, "Naam is verplicht"),
  phone_number: z.string().min(1, "Telefoonnummer is verplicht"),
});

export type ContactPerson = z.infer<typeof ContactPersonSchema>;

// Hoofd Contact schema
export const ContactSchema = z.object({
  BTWnumber: z.string().min(1, "BTW-nummer is verplicht"),
  KVKnumber: z.string().min(1, "KVK-nummer is verplicht"),
  address: z.string().min(1, "Adres is verplicht"),
  client_number: z.string().min(1, "Klantnummer is verplicht"),
  contacts: z.array(ContactPersonSchema).min(1, "Minstens één contactpersoon is verplicht"),
  created_at: z.string().datetime("Ongeldige datum/tijd"),
  id: z.number().int(),
  land: z.string().min(1, "Land is verplicht"),
  name: z.string().min(1, "Naam is verplicht"),
  phone_number: z.string().min(1, "Telefoonnummer is verplicht"),
  place: z.string().min(1, "Plaats is verplicht"),
  postal_code: z.string().min(1, "Postcode is verplicht"),
  types: z.enum(OP_CLIENT_TYPE, {
    errorMap: () => ({ message: "Selecteer een geldig type" })
  }),
  updated_at: z.string().datetime("Ongeldige datum/tijd"),
});

// Schema voor validatie
const invoiceTemplateItemSchema = z.object({
  description: z.string().min(1, "Omschrijving is verplicht"),
  item_tag: z.string().min(1, "Tag is verplicht"),
  source_column: z.string().min(1, "Bronkolom is verplicht"),
  source_table: z.string().min(1, "Brontabel is verplicht"),
});

type InvoiceTemplateItem = z.infer<typeof invoiceTemplateItemSchema> & { id?: number };
export type Contact = z.infer<typeof ContactSchema> & {invoice_template_items: InvoiceTemplateItem[]};

// CreateContact schema (zonder id, created_at, updated_at)
export const CreateContactSchema = ContactSchema.omit({ 
  id: true,
  created_at: true,
  updated_at: true 
});

export type CreateContact = z.infer<typeof CreateContactSchema>;