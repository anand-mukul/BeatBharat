import { z } from "zod";

export const SignUpFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Atleast 2 characters")
    .max(45, "Less than 45 characters")
    .regex(new RegExp("^[a-zA-Z ]+$"), "No special character allowed!"),
  lastName: z
    .string()
    .min(2, "Atleast 2 characters")
    .max(45, "Less than 45 characters")
    .regex(new RegExp("^[a-zA-Z ]+$"), "No special character allowed!"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters ")
    .max(50, "Password must be less than 50 characters"),
});

export const SignInFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters ")
    .max(50, "Password must be less than 50 characters"),
});
