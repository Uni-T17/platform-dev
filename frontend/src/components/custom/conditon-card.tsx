'use client'

import { conditionDescription, Option } from "@/lib/model/option";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";

type ConditionsProps<T extends FieldValues> = {
    control : Control<T>
    path : Path<T>
    label ?: string
    className ?: string
    options : Option[]
}

export default function ConditonCard<T extends FieldValues> (
    {control, 
    path,
    label,
    className, 
    options} : ConditionsProps<T>) {

        return(
            <FormField 
                control={control}
                name={path}
                render={({field}) => {
                    const selectedIndex = options.findIndex((opt) => opt.value === field.value);

                    return(
                        <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}

                        <input type="hidden" name={field.name} value={(field.value as string) ?? ''} onChange={field.onChange} ref={field.ref} readOnly/>
                        <div className="grid grid-cols-3 w-full">
                            {options.map((option, index) => {
                                const selected = index === selectedIndex
                                return(
                                        <Button
                                            variant="ghost"
                                            key={option.id} 
                                            type="button" 
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => {
                                                field.onChange(option.value)
                                                console.log("Selected index:", index);
                                            }}
                                            className={`h-auto mt-3 me-3 border focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors
                                                ${selected ? 'bg-[#F1FBF9] border-[#2B9B9B]': `bg-white hover:bg-[oklch(0.8_0.12_65)]`} `}
                                            >
                                            <div className="justify-between">
                                                <h1 className="text-black font-bold">{option.value}</h1>
                                                <span className="text-gray-600 whitespace-normal">{conditionDescription[index]}</span>
                                            </div>
                                         </Button>
                                    
                                )
                            })}
                        </div>
                        </FormItem>
                    )
                }
                }
            />
        )
}