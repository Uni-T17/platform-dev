import {z} from "zod"

export const SignInSchema = z.object({
    email : z.string(),
    password : z.string().min(6)
})

export type SignInForm = z.infer<typeof SignInSchema>

export const SignUpSchema = z.object({
    name : z.string(),
    email : z.string(),
    password : z.string().min(6),
    confirmPassword : z.string()
})

export type SignUpForm = z.infer<typeof SignUpSchema>

