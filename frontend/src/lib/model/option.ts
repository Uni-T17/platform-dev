import {  Category, Condition } from "./book"

export type Option = { id: string; value: string }

export const categoryOptions = Object.values(Category).map((value) => ({
    id : value,
    value : value
}))

export const conditionOptions = Object.values(Condition).map((value) => ({
    id : value,
    value : value
}))

export const conditionDescription = [
    "Excellent condition, barely used",
    "Minor signs of use, no major flaws",
    "Some wear, but fully functional",
    "Well-used but still readable",
    "Heavily worn, structural damage"
]