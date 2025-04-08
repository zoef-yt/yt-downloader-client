import { z } from 'zod';
import { formSchema } from './schema';

export type downloadOptionType = Record<string, { label: string; extensions: string[] }>;

export type formSchemaType = z.infer<typeof formSchema>;
