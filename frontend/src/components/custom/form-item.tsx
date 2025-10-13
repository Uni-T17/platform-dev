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
                    {label && <FormLabel className="font-semibold">{label}</FormLabel>}
                    <FormControl>
                        <Input className="border focus:border-[#2B9B9B] focus-visible:border-[#2B9B9B] focus-visible:ring-0 focus-visible:ring-offset-5 focus:outline-3" 
                        style={{backgroundColor : input_bg}} {...field} type={type || 'text'} placeholder={placeholder}  
                        onChange={(e) => {
                            if (type === 'number') {
                                const v = e.target.value;
                                field.onChange(v === "" ? "" : Number(v));
                            } else {
                                field.onChange(e);
                            }
                            }} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            }
        />
    )
}