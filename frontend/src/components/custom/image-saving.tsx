"use client"

import { Upload, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type ImageSavingProps<T extends FieldValues> = {
    control : Control<T>
    path : Path<T>
    onSave ?: (file: File) => void
}

export default function ImageSaving<T extends FieldValues>({
    control,
    path,
    onSave
} : ImageSavingProps<T>) {

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [preview, setPreview] = useState<string | null>(null)


    const {
    field: { value, onChange, name, ref },
    } = useController({ control, name: path as any });

     const changeFile = (e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(file) {
            onChange(file)
            setPreview(URL.createObjectURL(file))
        }
    }


    useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    }, [preview]);


    return(
        <Card className="mt-5">
            <CardTitle className="ms-3">Book Photos</CardTitle>
            <CardContent>
                
                <div className="place-items-center ">
                    <Upload/>
                    <h1 className="mt-3 mb-3">Upload photos of your book (front cover, condition details)</h1>

                    <Input name={name} ref={fileInputRef} onChange={changeFile} className="hidden" type="file"/>

                    <Button style={{backgroundColor : "white"}} onClick={() => fileInputRef.current?.click()} type="button" className="flex border-1 items-center">
                         <Plus style={{color : "black"}}/> <span className="text-black">Add Photos</span>
                    </Button>

                    {preview && (
                    <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-48 h-48 object-cover rounded-md border"
                    />
                    )}

                </div>

                
            </CardContent>
        </Card>
    )
}