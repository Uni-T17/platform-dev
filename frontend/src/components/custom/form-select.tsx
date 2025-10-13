import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { input_bg } from "@/app/color";
import { Option } from "@/lib/model/option";

export type CustomSelectProps<T extends FieldValues> = {
    control : Control<T>
    path : Path<T>
    options : Option[]
    label ?: string
    className ?: string
    placeholder : string
} 

export default function CustomSelect<T extends FieldValues> (
    {
        control,
        path,
        options,
        label,
        className,
        placeholder
    } : CustomSelectProps<T>){
        
        return(
            <FormField control={control} name={path} render={({field}) => 
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                            <SelectTrigger className="w-full border focus:border-[#2B9B9B] focus-visible:border-[#2B9B9B] focus-visible:ring-0 focus-visible:ring-offset-5 focus:outline-3" 
                                style={{backgroundColor : input_bg}}>
                                <SelectValue   placeholder={placeholder}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map(option =>
                                <SelectItem key={option.id} value={option.id}>{option.value}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </FormItem>
            }
            />
        )
}