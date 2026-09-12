import { z } from "zod";

export const registerSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
});

export const loginSchema = z.object({
  email: z.email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});
