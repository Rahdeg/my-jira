import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password must be at least 8 characters"),
});

export const RegisterSchema = z.object({
  name: z.string().min(3, "required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password must be at least 8 characters"),
});
