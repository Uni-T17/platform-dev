import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { input_bg } from "@/app/color";

type CustomFormProps<T extends FieldValues> = {
    control : Control<T>
    path : Path<T>
    label ?: string 
    type ?: React.HTMLInputTypeAttribute
    className ?: string
    placeholder ?: string
}

export default function CustomInput<T extends FieldValues> ({control, path, label, type, className, placeholder} : CustomFormProps<T>) {
    return(
        <FormField 
            control={control}
            name={path}
            render={({field}) => 
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input style={{backgroundColor : input_bg}} {...field} type={type || 'text'} placeholder={placeholder} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            }
        />
    )
}