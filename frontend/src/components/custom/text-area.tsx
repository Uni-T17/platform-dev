import { Control, FieldValues, Path } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { input_bg } from "@/app/color"


type TextAreaProps<T extends FieldValues> = {
    control : Control<T>
    path : Path<T>
    label ?: string
    className ?: string
    placeholder : string
}

export default function CustomTextArea<T extends FieldValues>({
    control,
    path,
    label,
    className,
    placeholder
} : TextAreaProps<T>) {
    return(
        <FormField 
            control={control}
            name={path}
            render={({field}) => 
                <FormItem className={className}>
                    {label && <FormLabel className="font-bold">{label}</FormLabel>}
                    <FormControl>
                        <Textarea className="border focus:border-[#2B9B9B] focus-visible:border-[#2B9B9B] focus-visible:ring-0 focus-visible:ring-offset-5 focus:outline-3" 
                        style={{backgroundColor : input_bg}} {...field} placeholder={placeholder}/>
                    </FormControl>
                </FormItem>
            }
        />
    )
}