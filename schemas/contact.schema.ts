import { OP_CLIENT_TYPE } from '@/types/contacts.types';
import { z } from 'zod';


export type OpClientType = typeof OP_CLIENT_TYPE[number];

// Schema for individual contact in the contacts array
const ContactPersonSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  phone_number: z.string(),
});

export type ContactPerson = z.infer<typeof ContactPersonSchema>;

// Main Contact schema
export const ContactSchema = z.object({
  BTWnumber: z.string(),
  KVKnumber: z.string(),
  address: z.string(),
  client_number: z.string(),
  contacts: z.array(ContactPersonSchema),
  created_at: z.string().datetime(), // or z.string() if you don't want datetime validation
  id: z.number().int(),
  land: z.string(),
  name: z.string(),
  phone_number: z.string(),
  place: z.string(),
  postal_code: z.string(),
  types: z.enum(OP_CLIENT_TYPE), // or z.string() if you want to allow any string
  updated_at: z.string().datetime(), // or z.string() if you don't want datetime validation
});

export type Contact = z.infer<typeof ContactSchema>;

// CreateContact schema (without id, created_at, updated_at)
export const CreateContactSchema = ContactSchema.omit({ 
  id: true,
  created_at: true,
  updated_at: true 
});

export type CreateContact = z.infer<typeof CreateContactSchema>;