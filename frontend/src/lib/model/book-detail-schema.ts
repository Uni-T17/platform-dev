import z from "zod";
import { Category, Condition } from "./book";


export const BookDetailsSchema = z.object({
    title : z.string(),
    author : z.string(),
    isbn : z.string(),
    category : z.enum(Category),
    condition : z.enum(Condition),
    description : z.string(),
    photo : z.file(),
    credit : z.number()
})

export type BookDetailsType = z.infer<typeof BookDetailsSchema>