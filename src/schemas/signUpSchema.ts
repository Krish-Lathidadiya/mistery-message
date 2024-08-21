import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more then 20 characters")
  .regex(/^[A-Za-z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
