import { z } from "zod"

export const SignInSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export type SignInForm = z.infer<typeof SignInSchema>

export const SignUpSchema = z.object({
    name: z.string().min(1, "Please enter your name"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})

export type SignUpForm = z.infer<typeof SignUpSchema>

export const RequestOtpSchema = z.object({
    email: z.email("Please enter a valid email"),
})

export type RequestOtpForm = z.infer<typeof RequestOtpSchema>

export const VarifyOtpSchema = z.object({
    email: z.email("Please enter a valid email"),
    otp: z.coerce.number().int().positive("Please enter the verification code"),
})

export type VarifyOtpForm = z.infer<typeof VarifyOtpSchema>
