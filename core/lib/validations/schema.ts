import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'adresse email est requise" })
    .email({ message: "Adresse email invalide" }),
  password: z
    .string()
    .min(1, { message: "Le mot de passe est requis" }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;