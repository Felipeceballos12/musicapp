import { z } from 'zod';

const accountSchema = z.object({
  codeVerifier: z.string(),
  expiresIn: z.number(),
  expires: z.string().optional(),
  refreshJwt: z.string().optional(),
  accessJwt: z.string().optional(),
});

export type PersistedAccount = z.infer<typeof accountSchema>;

export const schema = z.object({
  colorMode: z.enum(['system', 'light', 'dark']),
  session: z.object({
    currentAccount: accountSchema.optional(),
  }),
});

export type Schema = z.infer<typeof schema>;

export const defaults: Schema = {
  colorMode: 'system',
  session: {
    currentAccount: undefined,
  },
};
