import { z } from "zod";

export const PreferredContactEnum = z.enum(["Email"]);
export type PreferredContact = z.infer<typeof PreferredContactEnum>;

export const makeRequestSchema = (opts: { maxCredits: number }) =>
  z
    .object({
      offerCredits: z
        .number({ message: "Please enter an offer." })
        .int("Offer must be a whole number")
        .min(1, "Offer must be at least 1 credit")
        .max(opts.maxCredits, `You don't have enough credits`),

      phone: z
        .string({ message: "Phone number is required" })
        .min(7, "Phone number looks too short")
        .max(30, "Phone number looks too long"),

      email: z
        .string({ message: "Email is required" })
        .email("Enter a valid email"),

      address: z
        .string({ message: "Address is required" })
        .min(3, "Address must be at least 3 characters"),

      preferredContact: PreferredContactEnum,
      message: z.string().max(500).optional(),
    })
    .strict();

export type RequestFormData = z.infer<ReturnType<typeof makeRequestSchema>>;
