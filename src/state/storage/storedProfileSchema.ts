import * as z from 'zod/mini';

// Every field carries its own fallback, so one corrupt value resets only itself. Do not wrap a
// field in z.optional() on its own: a missing key would then be valid and its fallback would
// never run. Array fallbacks use a thunk so each parse gets a fresh array.
export const storedProfileSchema = z.object({
  version: z.literal(1),
  from: z.catch(z.string(), ''),
  paymentHeading: z.catch(z.string(), ''),
  paymentDetails: z.catch(z.string(), ''),
  recentInvoiceNumbers: z.catch(z.array(z.string()), () => []),
  pageSize: z.catch(z.optional(z.enum(['A4', 'LETTER'])), undefined),
  mode: z.catch(z.enum(['simple', 'detailed']), 'simple'),
});

export type StoredProfileRecord = z.infer<typeof storedProfileSchema>;
